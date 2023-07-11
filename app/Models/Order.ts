import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama_lengkap: string

  @column()
  public status: string

  @column()
  public terapis: string

  @column()
  public gender: string

  @column()
  public durasi: string

  @column()
  public tambahan: string

  @column({ serializeAs: null })
  public user_id: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
