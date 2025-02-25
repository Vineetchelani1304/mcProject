const Expenses = require('../Models/Expense.Model');
const User = require('../Models/User.Model');
const History = require('../Models/History.Model');
const Share = require('../Models/Share.Model');
const Personal = require('../Models/Personal.Model');
exports.createExpense = async (req, res) => {
    try {
        const userId = req.user.id; // Ensure req.user.id is correctly retrieved
        console.log("userId", userId);

        const { expenseHeading, descriptions } = req.body;

        if (!expenseHeading || !descriptions) {
            return res.status(403).json({
                success: false,
                message: 'All details are required'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User not found"
            });
        }

        const newExpense = await Expenses.create({
            expenseHeading: expenseHeading,
            descriptions: descriptions
        });

        await User.findByIdAndUpdate(
            userId,
            {
                $push: { expenses: newExpense._id }
            },
            { new: true }
        );

        console.log("New Expense: ", newExpense);

        res.status(200).json({
            success: true,
            data: newExpense,
            message: "Expense created successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the expense"
        });
    }
};


exports.SettleExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const { expenseId } = req.body;
        console.log("Settle Expense: ", expenseId);
        if (!expenseId) {
            return res.status(402).json({
                success: false,
                message: "No expense provided"
            });
        }

        // Retrieve the expense details
        const settleExpense = await Expenses.findById(expenseId);
        if (!settleExpense) {
            return res.status(403).json({
                success: false,
                message: "No such expense"
            });
        }

        // Add expense into history
        const history = (await History.create({ expense: settleExpense })).populate('expense');
        const populatedHistory = await History.findById(history._id).populate('expense');
        console.log("History created: ", populatedHistory);

        // Delete associated Share or Personal entries
        if (settleExpense.share) {
            const shareId = settleExpense.share;
            await Share.findByIdAndDelete(shareId);
        }
        if (settleExpense.personal) {
            const personalId = settleExpense.personal;
            await Personal.findByIdAndDelete(personalId);
        }

        // Update user's expenses list
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { expenses: expenseId } },
            { new: true }
        );

        // Delete the expense
        const deletedExpense = await Expenses.findByIdAndDelete(expenseId);
        if (deletedExpense) {
            return res.status(200).json({
                success: true,
                message: "Expense settled successfully",
                history: populatedHistory  // Send history details back to the client
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to settle the expense"
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while settling the expense"
        });
    }
};


exports.getUserExpenses = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Fetch the user and populate expenses
        const user = await User.findById(userId).populate({
            path: 'expenses',
            populate: {
                path: 'share personal',
                select: 'totalCost' // Select the fields you want to populate
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Fetched all expenses by the user",
            data: user.expenses
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the expenses"
        });
    }
};


exports.getExpenseDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { expenseId } = req.params; // Use req.params to retrieve expenseId
        let expenseDetails = await Expenses.findById(expenseId);

        if (!expenseDetails) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        // Conditionally populate based on the presence of share or personal
        if (expenseDetails.share) {
            expenseDetails = await Expenses.findById(expenseId).populate('share');
        } else if (expenseDetails.personal) {
            expenseDetails = await Expenses.findById(expenseId).populate('personal');
        }

        console.log("expenseDetails", expenseDetails);

        return res.status(200).json({
            success: true,
            message: "Fetched the data",
            data: expenseDetails
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};



