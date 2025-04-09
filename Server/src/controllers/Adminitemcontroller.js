import AdminItems from "../models/AdminItems.js";
import Admin from "../models/Admin.js";
import { v4 as uuidv4 } from 'uuid';

export const addItem = async (req, res) => {
    try {
        const { adminname, imageurl, name, price } = req.body;
        const existingadmin = await Admin.findOne({ name: adminname });
        if (!existingadmin) {
            return res.status(400).json({ message: 'Register your account first' });
        }
        console.log(req.body);

        const existingAdmin = await AdminItems.findOne({ adminname });

        if (existingAdmin) {

            existingAdmin.items.push({
                productId: String(uuidv4()),
                name: name,
                price: price,
                image: imageurl,
            });

            await existingAdmin.save();
            res.status(201).json({ message: 'Item added to existing admin successfully' });
        } else {
            const additem = new AdminItems({
                adminname: adminname,
                items: [
                    {
                        productId: String(uuidv4()),
                        name: name,
                        price: price,
                        image: imageurl,
                    }
                ]
            });
            await additem.save();
            res.status(201).json({ message: 'New admin and item added successfully' });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: 'Error adding item: ' + error.message });
    }
}

export const getItems = async (req, res) => {
    try {
        console.log('getItems request body:', JSON.stringify(req.body));
        const adminname = req.body.adminname || req.query.adminname;
        const existingAdmin = await AdminItems.findOne({ adminname });
        if (!existingAdmin) {
            return res.status(400).json({ message: 'No items found for this admin' });
        }
        const items = existingAdmin.items;
        console.log(items);
        res.status(200).json(items);
    } catch (error) {
        console.log(error);
        res.json({ message: 'Error getting items: ' + error.message });
    }
}
