import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nama', 255).nullable()
      table.string('no_telp', 50).nullable()
      table.string('nik', 180).nullable()
      table.string('status', 180).defaultTo("Aktif")
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).nullable()
      table.string('tanggal_lahir', 180).nullable()
      table.string('tempat_lahir', 180).nullable()
      table.string('image_url', 500).defaultTo("https://images-cdn.9gag.com/photo/azMoKjK_700b.jpg")
      table.boolean('verified').defaultTo(false)
      table.string('remember_me_token').nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
