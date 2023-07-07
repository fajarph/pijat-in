"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'users';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('nama', 255).notNullable();
            table.string('no_telp', 50).notNullable();
            table.string('nik', 180).nullable();
            table.string('status', 180).defaultTo("Aktif");
            table.string('email', 255).notNullable().unique();
            table.string('password', 180).notNullable();
            table.string('tanggal_lahir', 180).nullable();
            table.string('tempat_lahir', 180).nullable();
            table.string('image_url', 500).defaultTo("https://images-cdn.9gag.com/photo/azMoKjK_700b.jpg");
            table.string('remember_me_token').nullable();
            table.timestamp('created_at', { useTz: true }).notNullable();
            table.timestamp('updated_at', { useTz: true }).notNullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1688526262006_users.js.map