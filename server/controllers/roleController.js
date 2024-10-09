const Role = require('../models/roleModel');

// Get all roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching roles', error });
    }
};

// Get a specific role by ID
const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching role', error });
    }
};

// Create a new role
const createRole = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Check if the role already exists
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ message: 'Role already exists' });
        }

        const newRole = new Role({ name, description });
        const savedRole = await newRole.save();
        res.status(201).json(savedRole);
    } catch (error) {
        res.status(500).json({ message: 'Error creating role', error });
    }
};

// Update an existing role
const updateRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true } // Return the updated document
        );
        if (!updatedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: 'Error updating role', error });
    }
};

// Delete a role
const deleteRole = async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.id);
        if (!deletedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting role', error });
    }
};

// Export all the controller functions together
module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
};
