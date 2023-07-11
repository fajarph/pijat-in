import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('id_order', 100).notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('nama_lengkap', 255).notNullable()
      table.string('tanggal_pesanan', 100).notNullable()
      table.string('status', 255).defaultTo("Dijadwalkan")
      table.string('terapis', 255).nullable()
      table.string('gender', 100).notNullable()
      table.string('durasi', 255).notNullable()
      table.string('tambahan', 255).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
