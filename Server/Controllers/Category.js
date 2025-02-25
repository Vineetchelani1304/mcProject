const Share = require('../Models/Share.Model');
const Expense = require('../Models/Expense.Model');
const Personal = require('../Models/Personal.Model');
const User = require('../Models/User.Model')
const mailSender = require("../utils/emailSender")

exports.createShare = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            expenseId,
            itemsBought,
            itemsCount,
            totalCost,
            whoPaid,
            paymentDone,
            shareCountEmail,
            // photos 
        } = req.body;

        console.log("shareCountEmail",shareCountEmail)
        // Ensure shareCountEmail is an array
        if (!Array.isArray(shareCountEmail)) {
            return res.status(400).json({
                success: false,
                message: "shareCountEmail must be an array"
            });
        }

        const checkexpense = await Expense.findById(expenseId);

        if (!checkexpense) {
            return res.status(404).send({
                success: false,
                message: "Expense not found"
            });
        }

        if (checkexpense.share || checkexpense.personal) {
            return res.status(402).json({
                success: false,
                message: "Expense already has a share or personal entry. Each expense must have only one expenditure."
            });
        }

        const user = await User.findById(userId);
        console.log("emails :",shareCountEmail)

        // Send email to all shareCountEmail recipients
        if (user) {
            await mailSender(
                shareCountEmail, 
                "Expenditure Share", 
                `You have been added to an expense in sharing with ${shareCountEmail.join(', ')} by ${user.email}. Want to explore our website ExpenseTracker?`
            );
        }

        // Check if all required fields are provided
        if (!itemsBought || !itemsCount || !totalCost || !whoPaid || !paymentDone || shareCountEmail.length === 0) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        // Calculate perHead
        const perHead = totalCost / shareCountEmail.length;

        // Create new share record
        const newShare = await Share.create({
            itemsBought,
            itemsCount,
            totalCost,
            perHead,
            whoPaid,
            paymentDone,
            shareCountEmail,
            // photos 
        });

        const updateExpense = await Expense.findByIdAndUpdate(
            expenseId,
            { share: newShare._id },
            { new: true }
        ).populate("share");

        return res.status(201).json({
            success: true,
            data: updateExpense,
            message: "Share created successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the share"
        });
    }
};

exports.CreatePersonal = async (req, res) => {
    try {
        const { expenseId } = req.body;
        if (!expenseId) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        const checkexpense = await Expense.findById(expenseId);

        if (!checkexpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        console.log("Retrieved Expense:", checkexpense);

        // Check if the expense already has a share or personal field
        if (checkexpense) {
            if (checkexpense.share) {
                console.log("Expense already has a share entry:", checkexpense.share);
            }
            if (checkexpense.personal) {
                console.log("Expense already has a personal entry:", checkexpense.personal);
            }

            if (checkexpense.share || checkexpense.personal) {
                return res.status(402).json({
                    success: false,
                    message: "Expense already has a share or personal entry. Each expense must have only one expenditure."
                });
            }
        }

        const { itemsBought, itemsCount, totalCost, photos } = req.body;
        if (!itemsBought || !itemsCount || !totalCost) {
            return res.status(401).json({
                success: false,
                message: "Please enter all the required details"
            });
        }

        const newPersonal = await Personal.create({
            itemsBought,
            itemsCount,
            totalCost,
            photos
        });

        console.log("Personal details:", newPersonal);

        const updatedExpense = await Expense.findByIdAndUpdate(
            expenseId,
            { personal: newPersonal._id },
            { new: true }
        ).populate('personal');

        if (!updatedExpense) {
            return res.status(401).json({
                success: false,
                message: "Expense not found"
            });
        }

        console.log("Updated Expense:", updatedExpense);

        return res.status(201).json({
            success: true,
            data: updatedExpense,
            message: "Personal expense created successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the personal expense"
        });
    }
}



exports.UpdatePersonal = async (req, res) => {
    try {
        const { expenseId, personalId } = req.body;

        // Check if expenseId and personalId are provided
        if (!expenseId || !personalId) {
            return res.status(400).json({
                success: false,
                message: "Expense ID and Personal ID are required"
            });
        }

        // Check if the expense exists
        const expense = await Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        // Check if the personal expense exists
        const personal = await Personal.findById(personalId);
        if (!personal) {
            return res.status(404).json({
                success: false,
                message: "Personal expense not found"
            });
        }

        // Extract fields to be updated
        const { itemsBought, itemsCount, totalCost, photos } = req.body;

        // Update the personal expense
        const updatedPersonal = await Personal.findByIdAndUpdate(
            personalId,
            { itemsBought, itemsCount, totalCost, photos },
            { new: true }
        );

        console.log("Updated Personal details:", updatedPersonal);

        return res.status(200).json({
            success: true,
            data: updatedPersonal,
            message: "Personal expense updated successfully"
        });

    } catch (error) {
        console.error("Error updating personal expense:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the personal expense"
        });
    }
};

exports.UpdateShare = async (req, res) => {
    try {
        const { expenseId, shareId } = req.body;

        // Check if expenseId and shareId are provided
        if (!expenseId || !shareId) {
            return res.status(400).json({
                success: false,
                message: "Expense ID and Share ID are required"
            });
        }

        // Check if the expense exists
        const expense = await Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        // Check if the share expense exists
        const share = await Share.findById(shareId);
        if (!share) {
            return res.status(404).json({
                success: false,
                message: "Shared expense not found"
            });
        }

        // Extract fields to be updated
        const { itemsBought, itemsCount, totalCost, whoPaid, paymentDone, shareCount, photos } = req.body;

        // Calculate perHead if itemsCount and shareCount are provided
        let perHead;
        if (itemsCount && shareCount) {
            perHead = itemsCount / shareCount;
        }

        // Update the shared expense
        const updatedShare = await Share.findByIdAndUpdate(
            shareId,
            { itemsBought, itemsCount, totalCost, perHead, whoPaid, paymentDone, shareCount, photos },
            { new: true }
        );

        console.log("Updated Share details:", updatedShare);

        return res.status(200).json({
            success: true,
            data: updatedShare,
            message: "Shared expense updated successfully"
        });

    } catch (error) {
        console.error("Error updating shared expense:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the shared expense"
        });
    }
};
