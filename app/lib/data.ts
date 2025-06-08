import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchRevenue(): Promise<Revenue[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = await sql<Revenue[]>`SELECT * FROM revenue;`;
    return data;
  } catch (error) {
    console.error('Database Error [fetchRevenue]:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices(): Promise<LatestInvoiceRaw[]> {
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5;
    `;
    return data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
  } catch (error) {
    console.error('Database Error [fetchLatestInvoices]:', error);
    throw new Error('Failed to fetch latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      sql`SELECT COUNT(*)::int as count FROM invoices`,
      sql`SELECT COUNT(*)::int as count FROM customers`,
      sql`
        SELECT
          COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS paid,
          COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) AS pending
        FROM invoices
      `,
    ]);

    return {
      numberOfInvoices: invoiceCount[0].count,
      numberOfCustomers: customerCount[0].count,
      totalPaidInvoices: formatCurrency(invoiceStatus[0].paid),
      totalPendingInvoices: formatCurrency(invoiceStatus[0].pending),
    };
  } catch (error) {
    console.error('Database Error [fetchCardData]:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT invoices.id, invoices.amount, invoices.date, invoices.status,
             customers.name, customers.email, customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE customers.name ILIKE ${'%' + query + '%'}
         OR customers.email ILIKE ${'%' + query + '%'}
         OR invoices.amount::text ILIKE ${'%' + query + '%'}
         OR invoices.date::text ILIKE ${'%' + query + '%'}
         OR invoices.status ILIKE ${'%' + query + '%'}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;
    return invoices;
  } catch (error) {
    console.error('Database Error [fetchFilteredInvoices]:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)::int as count
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE customers.name ILIKE ${'%' + query + '%'}
         OR customers.email ILIKE ${'%' + query + '%'}
         OR invoices.amount::text ILIKE ${'%' + query + '%'}
         OR invoices.date::text ILIKE ${'%' + query + '%'}
         OR invoices.status ILIKE ${'%' + query + '%'};
    `;
    return Math.ceil(data[0].count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error [fetchInvoicesPages]:', error);
    throw new Error('Failed to fetch total invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT id, customer_id, amount, status
      FROM invoices
      WHERE id = ${id};
    `;
    if (!data.length) return null;
    return {
      ...data[0],
      amount: data[0].amount / 100,
    };
  } catch (error) {
    console.error('Database Error [fetchInvoiceById]:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    return await sql<CustomerField[]>`
      SELECT id, name
      FROM customers
      ORDER BY name ASC;
    `;
  } catch (error) {
    console.error('Database Error [fetchCustomers]:', error);
    throw new Error('Failed to fetch customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
      SELECT customers.id, customers.name, customers.email, customers.image_url,
             COUNT(invoices.id) AS total_invoices,
             COALESCE(SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END), 0) AS total_pending,
             COALESCE(SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END), 0) AS total_paid
      FROM customers
      LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE customers.name ILIKE ${'%' + query + '%'}
         OR customers.email ILIKE ${'%' + query + '%'}
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
      ORDER BY customers.name ASC;
    `;

    return data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));
  } catch (error) {
    console.error('Database Error [fetchFilteredCustomers]:', error);
    throw new Error('Failed to fetch customer data.');
  }
}
