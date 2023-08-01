import { DateTime } from 'luxon'
import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm'

export default class OrderHistory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public status_sebelumnya: string

  @column()
  public created_history: DateTime

  @column({ serializeAs: null })
  public order_id: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
