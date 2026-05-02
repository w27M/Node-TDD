import mysql, { Connection } from 'mysql2/promise'

export const MySQLHelper = {
  client: null as Connection,

  async connect (config: any): Promise<void> {
    this.client = await mysql.createConnection(config)
  },

  async disconnect (): Promise<void> {
    if (this.client) {
      await this.client.end()
    }
    this.client = null
  },

  async execute (query: string, params?: any[]): Promise<any> {
    const [rows] = await this.client.execute(query, params)
    return rows
  }
}
