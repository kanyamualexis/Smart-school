
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-RW', { 
    style: 'currency', 
    currency: 'RWF' 
  }).format(amount).replace('RWF', 'FRw');
};
