import pool from '../utils/pool';
export default class Beer {
    id;
    name;
    style;
    hops;

    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.style = row.style;
        this.hops = row.hops;
    }

    static async insert({ name, style, hops }) {
        const { rows } = await pool.query(
            `INSERT INTO beers (name, style, hops)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [name, style, hops]
        );
        return new Beer(rows[0]);
    }

    static async getAll() {
        const { rows } = await pool.query('SELECT * FROM beers');
        return rows.map((row) => new Beer(row));
    }

    static async getById(id) {
        const { rows } = await pool.query('SELECT * FROM beers WHERE id=$1', [id]);
        return new Beer(rows[0]);
    }

    static async updateById(id, { name, style, hops }) {
        const existingBeer = await Beer.getById(id);
        const newName = name ?? existingBeer.name;
        const newStyle = style ?? existingBeer.style;
        const newHops = hops ?? existingBeer.hops;

        const { rows } = await pool.query(
          'UPDATE beers SET name=$1, style=$2, hops=$3 WHERE id=$4 RETURNING *',
            [newName, newStyle, newHops, id]
        );
        return new Beer(rows[0]);
        }

    static async deleteById(id) {
        const { rows } = await pool.query(
            'DELETE FROM beers WHERE id=$1 RETURNING *',
            [id]
        );
        return new Beer(rows[0]);
    }

};
