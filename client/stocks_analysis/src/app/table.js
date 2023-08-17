import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button, Grid } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import 'boxicons'

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell,{ tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow,{tableRowClasses} from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Pagination  from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import TableFooter from '@mui/material/TableFooter';

import { Tooltip } from '@nextui-org/react';



const StyledTableCell = styled(TableCell)(({ theme,mode }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: mode ? "#16181A" : "rgba(236,237,238,0.8)    ",
    color: mode ? "#FFFFFF" : "#16181A",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  
  backgroundColor: mode ? "#313538" : "#FFFFFF",
  color: mode ? "#FFFFFF" : "#16181A",
 
  
  
}));

const StyledTableRow = styled(TableRow)(({ theme,mode }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: mode ? "#313538" : "#FFFFFF",
  color: mode ? "#FFFFFF" : "#16181A",
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  [`&.${tableRowClasses}`]: {
    backgroundColor: mode ? "#16181A" : "rgba(236,237,238,0.8)    ",
    color: mode ? "#FFFFFF" : "#16181A",
  },
  
  
}));

const CollapsibleTable = ({ data,itemsPerPage,mode  }) => {
  const temp_router = useRouter();
    const nodata = 5
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const [expandedRow, setExpandedRow] = React.useState(null);

  const handleExpand = (rowIndex) => {
    if (expandedRow === rowIndex) {
      setExpandedRow(null);
    } else {
      setExpandedRow(rowIndex);
    }
  };

  const travel = (script)=>{
    //e.preventDefault()
    temp_router.push(`/stocks/${script}`)
  }

  return (
    <div>
         <TableContainer component={Paper}>
      <Table className="xyz" aria-label="collapsible table">
        <TableHead>
          <StyledTableRow mode={mode}>
            <StyledTableCell mode={mode}><b>Index</b></StyledTableCell>
            <StyledTableCell mode={mode}><b>Symbol</b></StyledTableCell>
            <StyledTableCell mode={mode}><b>Stock Name</b></StyledTableCell>
            <StyledTableCell mode={mode}><b>Price</b></StyledTableCell>
            <StyledTableCell mode={mode}><b>Previous Close</b></StyledTableCell>
            <StyledTableCell mode={mode}><b>Change</b></StyledTableCell>
            <StyledTableCell mode={mode}><b>Volume</b></StyledTableCell>
            <StyledTableCell mode={mode}><b>52W High</b></StyledTableCell>
            <StyledTableCell mode={mode}><b>52W Low</b></StyledTableCell>
            <StyledTableCell mode={mode}><b>More</b></StyledTableCell>
            
          </StyledTableRow>
        </TableHead>
        <TableBody>
        {data.length !== 0 ? 
          currentData.map((row, index) => (
            <React.Fragment key={index}>
              <StyledTableRow mode={mode}>
                <StyledTableCell mode={mode}>{startIndex+index+1}</StyledTableCell>
                <StyledTableCell mode={mode}><p onClick={abc=>{travel(row.symbol)}}>{row.symbol}</p></StyledTableCell>
                <StyledTableCell mode={mode}>{row.shortName}</StyledTableCell>
                <StyledTableCell mode={mode}>₹{row.currentPrice}</StyledTableCell>
                <StyledTableCell mode={mode}>₹{row.previousClose}</StyledTableCell>
                <StyledTableCell mode={mode}><p style={{color: (((row.currentPrice-row.previousClose)/row.previousClose)*100).toFixed(2) >=0 ? "green" : "red"}}>{(((row.currentPrice-row.previousClose)/row.previousClose)*100).toFixed(2)}%</p></StyledTableCell>
                <StyledTableCell mode={mode}>{row.volume}</StyledTableCell>
                <StyledTableCell mode={mode}>₹{row.fiftyTwoWeekHigh}</StyledTableCell>
                <StyledTableCell mode={mode}>₹{row.fiftyTwoWeekLow}</StyledTableCell>
                <StyledTableCell mode={mode}>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => handleExpand(index)}
                  >
                    {expandedRow === index ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow mode={mode}>
                <StyledTableCell mode={mode} style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                  <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                    <div className='parentTable'>
                    <p><b>Details: </b></p>
                      <div className='tableGrid'>
                          <p>Day High: ₹{row.dayHigh}</p>
                          
                          <p>Day Low: ₹{row.dayLow}</p>
                          <div className='innertable'>
                            <p>Beta : {row.beta}</p>
                            <Tooltip placement="right" content={"Beta is a concept that measures the expected move in a stock relative to movements in the overall market."}><button ><box-icon name='question-mark' size="xs"></box-icon></button ></Tooltip>
                          </div>
                          <div className='innertable'>
                          <p>Forward PE: {row.forwardPE} </p>
                          <Tooltip placement="right" content={"The forcast of future price-to-earnings (P/E) ratio relates a company's share price to its earnings per share."}><button ><box-icon name='question-mark' size="xs"></box-icon></button ></Tooltip>
                          </div>
                          <div className='innertable'>
                          <p>Trailing PE: {row.trailingPE} </p>
                          <Tooltip placement="right" content={"Trailing price-to-earnings (P/E) is a relative valuation multiple that is based on the last 12 months of actual earnings."}><button ><box-icon name='question-mark' size="xs"></box-icon></button ></Tooltip>
                          </div>
                          <div className='innertable'>
                          <p>Forward EPS: {row.forwardEps} </p>
                          <Tooltip placement="right" content={"EPS indicates how much money a company makes for each share of its stock and is a widely used metric for estimating corporate value of the future."}><button ><box-icon name='question-mark' size="xs"></box-icon></button ></Tooltip>

                          </div>
                          <div className='innertable'>
                          <p>Trailing EPS: {row.trailingEps} </p>
                          <Tooltip placement="right" content={"Trailing earnings per share (EPS) is a company's earnings generated over a prior period (often a fiscal year) reported on a per-share basis."}><button ><box-icon name='question-mark' size="xs"></box-icon></button ></Tooltip>

                          </div>
                          <p>Market Capital: ₹{row.marketCap}</p>

                          <div className='innertable'>
                          <p>Revenue Growth: {row.revenueGrowth}%</p>
                          <Tooltip placement="right" content={"Applying a growth rate on revenue can help determine the future earnings growth."}><button ><box-icon name='question-mark' size="xs"></box-icon></button ></Tooltip>

                          </div>
                          <div className='innertable'>
                          <p>Return on Assets : {row.returnOnAssets}%</p>
                          <Tooltip placement="right" content={"The ROA figure gives investors an idea of how effective the company is in converting the money it invests into net income."}><button ><box-icon name='question-mark' size="xs"></box-icon></button ></Tooltip>

                          </div>
                          <div className='innertable'>
                          <p>Return on Equity :{row.returnOnEquity}% </p>
                          <Tooltip placement="right" content={"ROE is a gauge of a corporation's profitability and how efficiently it generates those profits."}><button ><box-icon name='question-mark' size="xs"></box-icon></button ></Tooltip>

                          </div>
                          <div className='innertable'>
                          <p>EBITDA : {row.ebitdaMargins}% </p>
                          <Tooltip placement="right" content={"The EBITDA margin shows how much operating expenses are eating into a company's gross profit."}><button ><box-icon name='question-mark' size="xs"></box-icon></button ></Tooltip>

                          </div>
                          
                          

                      </div>
                    </div>
                    
                  </Collapse>
                </StyledTableCell>
              </StyledTableRow>
            </React.Fragment>
          )):
          Array.from({ length: itemsPerPage }, (_, index) => (
            <StyledTableRow key={index}>
               <StyledTableCell colSpan={1}>
                    <Skeleton animation="wave" />
                </StyledTableCell>

                <StyledTableCell colSpan={1}>
                    <Skeleton animation="wave" />
                </StyledTableCell>
                
                <StyledTableCell colSpan={1}>
                    <Skeleton animation="wave" />
                </StyledTableCell>
                <StyledTableCell colSpan={1}>
                    <Skeleton animation="wave" />
                </StyledTableCell>
                <StyledTableCell colSpan={1}>
                    <Skeleton animation="wave" />
                </StyledTableCell>
                <StyledTableCell colSpan={1}>
                    <Skeleton animation="wave" />
                </StyledTableCell>
                <StyledTableCell colSpan={1}>
                    <Skeleton animation="wave" />
                </StyledTableCell>
                <StyledTableCell colSpan={1}>
                    <Skeleton animation="wave" />
                </StyledTableCell>
                <StyledTableCell colSpan={1}>
                    <Skeleton animation="wave" />
                </StyledTableCell>
                <StyledTableCell colSpan={1}>
                    <Skeleton animation='wave' variant="circular" width={25} height={25} />
                </StyledTableCell>
            </StyledTableRow>
          ))
           
          }
        </TableBody>
        
        
        
        
      </Table>
      <Pagination
            
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            
          />
    
    </TableContainer>
       
    </div>
   
    
  );
};

export default CollapsibleTable;
