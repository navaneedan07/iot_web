# Expense Tracker App

A modern, lightweight React web application for tracking and managing your daily expenses with real-time analytics and category breakdown.

## Features

- ✅ **Add Expenses**: Quickly add new expenses with description, amount, category, and date
- 📊 **Real-time Summary**: View total expenses, monthly spending, average expense, and total entries
- 🏷️ **Categories**: Pre-defined categories including Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Education, and More
- 🔍 **Filter & Sort**: Filter expenses by category and sort by date, amount, or description
- ✏️ **Edit Expenses**: Update existing expenses inline
- 🗑️ **Delete Expenses**: Remove expenses you no longer need
- 💾 **Data Persistence**: All expenses are automatically saved to browser's localStorage
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with animations and gradients
- **localStorage** - Client-side data persistence

## Installation

1. Clone or navigate to the project directory:
```bash
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. The app will automatically open in your browser at `http://localhost:5173`

3. **Add an Expense**:
   - Enter a description (e.g., "Lunch at cafe")
   - Enter the amount in dollars
   - Select a category from the dropdown
   - Choose the date
   - Click "Add Expense"

4. **Manage Expenses**:
   - Use the filter dropdown to view expenses from specific categories
   - Use the sort dropdown to organize expenses by date, amount, or description
   - Click the edit icon (✏️) to modify an expense
   - Click the delete icon (🗑️) to remove an expense

5. **View Summary**:
   - Total all-time expenses
   - Current month's spending
   - Average expense amount
   - Total number of entries
   - Top spending category with breakdown

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Features in Detail

### Smart Analytics
- Automatic calculation of spending by category
- Visual progress bars showing category distribution
- Identification of your top spending category
- Monthly spending tracking

### User-Friendly Interface
- Clean, intuitive layout
- Responsive controls that adapt to screen size
- Smooth animations and transitions
- Clear visual feedback for all interactions

### Data Management
- All data stored locally in your browser
- No server required
- Export by copying from localStorage if needed
- Data persists across browser sessions

## Keyboard Shortcuts

- Enter - Submit the form (while in input field)

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Future Enhancements

Potential features for future versions:
- Export expenses to CSV/PDF
- Budget limits and alerts
- Recurring expenses
- Multiple accounts/profiles
- Dark mode
- Charts and graphs
- Cloud synchronization

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Contributing

Feel free to fork, modify, and improve this project!

---

Built with ❤️ using React and Vite
