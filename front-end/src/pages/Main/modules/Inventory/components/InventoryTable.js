import {
  Box,
  Grid,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ImportInventoryMenu from "../../../components/ImportInventoryMenu";
import { useEffect, useState } from "react";
import { authedRequest } from "../../../../../http";
import NoProductsIcon from "../../../../../assets/no-products.jpg";

export default function InventoryTable() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await authedRequest.get(
          `/api/goods?page=${page}&pageSize=10`
        );
        if (res && res.data) {
          setProducts(res.data.data);
          setTotal(res.data.total);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchMyProducts();
  }, [page]);

  return (
    <Box>
      <Box className={"d-flex justify-content-between"}>
        <Typography variant={"subtitle1"}>
          You have {products.length} items on the inventory
        </Typography>
        <ImportInventoryMenu />
      </Box>
      {products.length === 0 && (
        <Box textAlign={"center"}>
          <img src={NoProductsIcon} width={"70%"} />
        </Box>
      )}
      {products.length > 0 && (
        <TableContainer className={"mt-3 p-3"} component={Paper}>
          <Grid container>
            <Grid item xs={12} lg={8}>
              <TextField />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Pagination
                className={"mt-3"}
                page={page}
                onChange={(e, newPage) => {
                  setPage(newPage);
                }}
                showFirstButton
                showLastButton
                count={Math.ceil(total / 10)}
              />
            </Grid>
          </Grid>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Store</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Brand</strong>
                </TableCell>
                <TableCell>
                  <strong>Price</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((product) => {
                return (
                  <TableRow key={product._id}>
                    <TableCell>{product.store}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.price}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
