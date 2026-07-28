// Example in src/components/CustomerTable.jsx
import { customerService } from '../services/customerService';

const fetchCustomers = async () => {
  try {
    const response = await customerService.getAll();
    console.log(response.data);
  } catch (error) {
    console.error('Failed to load customers:', error);
  }
};