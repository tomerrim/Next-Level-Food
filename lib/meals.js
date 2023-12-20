import fs from "node:fs";
import sql from 'better-sqlite3';
import slugify from "slugify";
import xss from "xss";

const db = sql('meals.db');

export function getMeals() {
    return db.prepare('SELECT * FROM meals').all()
}

export function getMeal(slug) {
    // ? and then .get(slug) is a safer way than `${slug}` provided by better-sqlite3
    // to prevent sql injections 
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
    // generate a slug from the title
    meal.slug = slugify(meal.title, { lower: true });

    // protect from cross site scripting
    meal.instructions = xss(meal.instructions);

    const extension = meal.image.name.split(".").pop();
    const fileName = `${meal.slug}.${extension}`;

    // create a writable stream on public/images folder
    const stream = fs.createWriteStream(`public/images/${fileName}`);

    // write the stream, stream.write() accept buffer so we need to convert the image to array buffer
    // and then pass it as a buffer and not as arrayBuffer -> Buffer.from(bufferImage)
    const bufferImage = await meal.image.arrayBuffer();
    stream.write(Buffer.from(bufferImage), (error) => {
        if (error) throw new Error("Saving image failed!");
    });

    // meal.image now holds the path to the image and not the image itself
    meal.image = `/images/${fileName}`;

    // save meal into the database
    db.prepare(`
        INSERT INTO meals
        (title, summary, instructions, creator, creator_email, image, slug)
        VALUES(
            @title,
            @summary,
            @instructions,
            @creator,
            @creator_email,
            @image,
            @slug
        )
    `).run(meal);

}