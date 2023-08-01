import { DateTime } from 'luxon'
import { 
  BaseModel, 
  column,
  hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'
import OrderHistory from './OrderHistory';

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

  @column()
  public tanggal_pesanan: string

  @column()
  public jam: string

  @column()
  public harga: string

  @column()
  public id_pesanan: string

  @column({ serializeAs: null })
  public user_id: number | null

  @hasMany(() => OrderHistory, {
    foreignKey: 'order_id',
  })
  public order_histories: HasMany<typeof OrderHistory>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
