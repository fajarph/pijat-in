import BaseSchema from '@ioc:Adonis/Lucid/Schema'

function generateRandomValue(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }

  return result
}

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().defaultTo(generateRandomValue(5))
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('nama_lengkap', 255).notNullable()
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
