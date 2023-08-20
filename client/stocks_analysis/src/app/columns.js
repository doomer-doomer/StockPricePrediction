export default [
    { 
        field: 'id', 
        headerName: 'ID', 
        width: 90 
    },
    {
        field: 'shortName',
        headerName: 'Stock Name',
        width: 200,
        editable: true,
    },
    {
        field: 'currentPrice',
        headerName: 'Price',
        type: 'number',
        width: 150,
        editable: true,
    },
    {
        field: 'previousClose',
        headerName: 'Previous Close',
        type: 'number',
        width: 150,
        editable: true,
    },
    {
        field: 'change',
        headerName: 'Change',
        type: 'number',
        width: 150,
        editable: true,
    },
    {
        field: 'volume',
        headerName: 'Volume',
        type: 'number',
        width: 150,
        editable: true,
    },
    {
        field: 'fiftyTwoWeekHigh',
        headerName: '52W High',
        type: 'number',
        width: 150,
        editable: true,
    },
    {
        field: 'fiftyTwoWeekLow',
        headerName: '52W Low',
        type: 'number',
        width: 150,
        editable: true,
    },

  ]