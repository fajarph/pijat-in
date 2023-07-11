import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { 
  column, 
  beforeSave, 
  BaseModel,
  hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'
import Order from './Order'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nama: string

  @column()
  public no_telp: string

  @column()
  public nik: string

  @column()
  public status: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public tanggal_lahir: string

  @column()
  public tempat_lahir: string

  @column()
  public image_url: string

  @column()
  public rememberMeToken: string | null

  @hasMany(() => Order, {
    foreignKey: 'user_id', // defaults to userId
  })
  public orders: HasMany<typeof Order>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
