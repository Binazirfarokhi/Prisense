import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {Box} from "@mui/material";
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import {useEffect, useState} from "react";
export function SortArrow({onSort, defaultValue}) {

  const [sort, setSort] = useState( 'no');




  const sortIcon = {
    'no': <UnfoldMoreIcon />,
    'asc': <ArrowDropUpIcon />,
    'desc': <ArrowDropDownIcon />
  }

  const nextIcon = {
    'no': 'asc',
    'asc': 'desc',
    'desc': 'no'
  }

  useEffect(() => {
    onSort && onSort(sort);
  }, [sort]);

  useEffect(() => {
    if (typeof defaultValue === 'undefined') {
      setSort('no');
    }
  }, [defaultValue]);

  return (
    <Box
      role={'button'}
      onClick={() => {
        setSort(nextIcon[sort])
      }}>
      {sortIcon[sort]}
    </Box>
  )
}