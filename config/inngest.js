import { Inngest } from "inngest";
import connectDB from "./db";
import User from "./models/User"; // ✅ Import your mongoose User model, not from clerk

export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest Function to Create User
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    {
        event: 'clerk/user.created'
    },  // ✅ comma was missing here
    async ({ event }) => {  // ✅ destructure {event} properly
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,  // ✅ typo: emai_ → email_
            name: first_name + ' ' + last_name,       // ✅ added space between names
            imageUrl: image_url
        };
        await connectDB();
        await User.create(userData);
    }
);

// Inngest Function to Update User
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {
        event: 'clerk/user.updated'
    },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            email: email_addresses[0].email_address,  // ✅ typo fixed
            name: first_name + ' ' + last_name,       // ✅ space added
            imageUrl: image_url
        };
        await connectDB();
        await User.findByIdAndUpdate(id, userData);
    }
);

// Inngest Function to Delete User
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-from-clerk'
    },
    {
        event: 'clerk/user.deleted'
    },
    async ({ event }) => {
        const { id } = event.data;  // ✅ destructure id from event.data
        await connectDB();
        await User.findByIdAndDelete(id);  // ✅ pass id to delete correct user
    }
);