import {
    Alert,
    Box,
    Button, CircularProgress, DialogContent, Drawer, Fab,
    Grid, IconButton, Pagination,
    Paper,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField, Typography
  } from "@mui/material";
  import FormControlLabel from '@mui/material/FormControlLabel';
  import Checkbox from '@mui/material/Checkbox';
  import {useState} from "react";
  import {authedRequest} from "../../../../../http";
  import AddIcon from '@mui/icons-material/Add';
  import BackButton from "../../../../../components/BackButton";
  import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
  import { DatePicker } from '@mui/x-date-pickers/DatePicker';
  import Slider from '@mui/material/Slider';
  import moment from "moment";
  import {useStoreNames} from "../../../../../hooks/useStoreNames";
  
  export default function ImportBySearch() {
    const [loading, setLoading] = useState(false);
    const [productName, setProductName] = useState('');
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [addProducts, setAddProducts] = useState({});
    const [added, setAdded] = useState([]);
    const [total, setTotal] = useState(0);
    const [searched, setSearched] = useState(false);
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [advancedConditions, setAdvancedConditions] = useState({});
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [checkedStores, setCheckedStores] = useState([]);
    const {storeNames} = useStoreNames();
    const [errors, setErrors] = useState({});
    const marks = [
      {
        value: 0,
        label: '$0',
      },
      {
        value: 400,
        label: '$400',
      },
      {
        value: 1000,
        label: '$1000',
      },
      {
        value: 2000,
        label: '$2000',
      },
      {
        value: 4000,
        label: '$4000'
      },
      {
        value: 5000,
        label: '$5000'
      }
    ];
    const handleClickSearch = async (page = 1) => {
      
      setLoading(true);
      const startDate = advancedConditions.startDate ? advancedConditions.startDate.format('YYYY-MM-DD') : '';
      const endDate = advancedConditions.endDate ? advancedConditions.endDate.format('YYYY-MM-DD') : '';
  
  
      const res = await authedRequest.get(`/api/goods/search?page=${page}&pageSize=10&productName=${productName}
          &dateRange=${[startDate, endDate].join(',')}
          &priceRange=${priceRange.join(',')}
          &stores=${checkedStores.join(',')}
        `);
      if (res && res.data) {
        const items = res.data.data;
        const uniqueItems = [];
        const itemsKey = {};
        for (let item of items) {
          const key = [item.name, item.package, item.unit, item.brand].join('-');
          if (!itemsKey[key]) {
            uniqueItems.push(item);
            itemsKey[key] = true;
          }
        }
        setSearchedProducts(uniqueItems);
        setTotal(res.data.total);
      }
      setError(false);
      setSearched(true);
      setLoading(false);
    }
  
    const handleClickAdd = async (id) => {
      const product = addProducts[id];
      if (!product) {
        return;
      }
      const currentPrice = product.currentPrice;
  
      if (Number.isNaN(currentPrice) || currentPrice <= 0) {
        return setErrors({
          ...errors,
          [id]: "Please enter a valid price!"
        })
      }
  
      const productData = searchedProducts.find(item => item._id === id);
      if (productData) {
        setAddProducts({
          ...addProducts,
          [id]: {
            ...product,
            loading: true
          }
        });
  
        await authedRequest.post(`/api/watching-list`, {
          name: productData.name,
          package: productData.package,
          brand: productData.brand,
          unit: productData.unit,
          price: Number(currentPrice)
        });
        setAddProducts({
          ...addProducts,
          [id]: {
            ...product,
            loading: false,
            added: true
          }
        });
  
  
  
      }
    }
  
  
    return (
      <Box>
        <BackButton/>
        <Drawer
          onClose={() => {
            setAdvancedOpen(false)
          }}
          open={advancedOpen} anchor={'right'}>
          <DialogContent>
            <Typography variant={'h4'}>Advanced Search</Typography>
            <Box className={'d-none d-lg-block'} width={'600px'}></Box>
            <Box className={'d-block d-lg-none'} width={'350px'}></Box>
            <Box className={'mt-5'}>
              <Typography>Product Name</Typography>
              <TextField
                value={advancedConditions.name || ''}
                onChange={e => {
                  setProductName(e.target.value)
                  setAdvancedConditions({
                    ...advancedConditions,
                    name: e.target.value
                  })
                }}
                margin={'dense'} fullWidth label={'Product name'}/>
            </Box>
            <Box className={'mt-5'}>
              <Typography>Date Range</Typography>
              <DemoContainer
                components={['DateTimePicker']}>
                <DatePicker
                  value={advancedConditions.startDate || null}
                  onChange={(e, val)=> {
                    setAdvancedConditions({
                      ...advancedConditions,
                      startDate: e
                    })
                  }}
                  label="From" />
              </DemoContainer>
              <DemoContainer
                sx={{marginTop: '20px'}} components={['DateTimePicker']}>
                <DatePicker
                  value={advancedConditions.endDate || null}
                  onChange={(e, val)=> {
                    console.log(e)
                    setAdvancedConditions({
                      ...advancedConditions,
                      endDate: e
                    })
                  }}
                  label="To" />
              </DemoContainer>
              {advancedConditions.startDate
                && advancedConditions.endDate
                && moment(advancedConditions.startDate.toDate()).isAfter(moment(advancedConditions.endDate.toDate()))
                && (
                  <p className={'text-danger mt-2'}>
                    End Date must after the start date.
                  </p>
                )}
            </Box>
            <Box className={'mt-5'}>
              <Typography>Price Range</Typography>
              <Slider
                aria-label="Always visible"
                value={priceRange}
  
                onChange={(e, val) => {
                  setPriceRange(val);
                }}
                min={0}
                max={5000}
                step={1}
                marks={marks}
                valueLabelDisplay="auto"
              />
            </Box>
            <Box className={'mt-4'}>
              <Typography>Types of Retail Stores</Typography>
              <Box>
                {storeNames.map(store => {
                  return (
                    <FormControlLabel
                      key={store}
                      control={<Checkbox
                        onChange={e => {
                          if (e.target.checked) {
                            setCheckedStores([...checkedStores, store])
                          } else {
                            setCheckedStores(checkedStores.filter(item => item !== store))
                          }
                        }}
                        checked={checkedStores.includes(store)} />} label={store} />
                  )
                })}
              </Box>
              <Box className={'mt-2'}>
                <Button
                  onClick={() => {
                    setCheckedStores(storeNames)
                  }}
                  color={'primary'}>Select All</Button>
                <Button
                  onClick={() => {
                    setCheckedStores([])
                  }}
                  color={'inherit'}>Clear ALl</Button>
              </Box>
            </Box>
            <Box className={'mt-5'}>
              <Button
                onClick={() => {
                  handleClickSearch(page)
                  setAdvancedOpen(false);
                }}
                className={'me-2'} variant={'contained'}>Search</Button>
              <Button
                className={'me-2'}
                onClick={() => {
                  setAdvancedOpen(false)
                }}
                variant={'contained'} color={'inherit'}>Cancel</Button>
              <Button
                onClick={() => {
                  setProductName('');
                  setAdvancedConditions({});
                  setPriceRange([0, 5000]);
                  setCheckedStores([]);
                }}
              >Clear</Button>
            </Box>
          </DialogContent>
        </Drawer>
  
        <Grid marginTop={'20px'} spacing={2} container>
          <Grid item xs={12} lg={8}>
            <TextField
              error={error}
              helperText={error ? 'Please enter product name' : ''}
              value={productName}
              onChange={e => {
                setProductName(e.target.value)
                setAdvancedConditions({
                  ...advancedConditions,
                  name: e.target.value
                })
              }}
              size={'small'}
              label={'Product Name'}
              fullWidth/>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Button
              onClick={() => {
                if (!productName) {
                  return setError(true);
                } else {
                  setError(false);
                }
  
                handleClickSearch(page)
              }}
              variant={'contained'}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                setAdvancedOpen(true)
              }}
              className={'ms-4'}>Advanced</Button>
          </Grid>
  
        </Grid>
  
        <Box>
      {loading && (
          <Box className={"d-flex justify-content-center"}>
            <CircularProgress />
          </Box>
        )}
      </Box>
  
        {searched &&(<TableContainer style={{marginTop: '20px'}} component={Paper}>
          <Box className={'d-flex justify-content-between p-3'}>
            <Typography>{total} Products Found</Typography>
            <Pagination className={'p-3'}
                        page={page}
                        onChange={(e, newPage) => {
                          setPage(newPage);
                          handleClickSearch(newPage);
                        }}
                        count={Math.ceil(total / 10)} showFirstButton showLastButton />
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Package</strong>
                </TableCell>
                <TableCell>
                  <strong>Unit</strong>
                </TableCell>
                <TableCell>
                  <strong>Brand</strong>
                </TableCell>
                <TableCell>
                  <strong>Highest</strong>
                </TableCell>
                <TableCell>
                  <strong>Lowest</strong>
                </TableCell>
                {/* <TableCell>
                  <strong>Store</strong>
                </TableCell> */}
                <TableCell>
                  <strong>Current Price</strong>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchedProducts.map(product => {
                const addProduct = addProducts[product._id];
                return (
                  <TableRow key={product._id}>
                    <TableCell>
                      {product.name}
                    </TableCell>
                    <TableCell>
                      {product.package}
                    </TableCell>
                    <TableCell>
                      {product.unit}
                    </TableCell>
                    <TableCell>
                      {product.brand}
                    </TableCell>
                    <TableCell>
                      ${product.highest.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      ${product.lowest.toFixed(2)}
                    </TableCell>
                    {/* <TableCell>
                      {product.store}
                    </TableCell> */}
                    <TableCell>
                      <TextField
                        error={Boolean(errors[product._id])}
                        helperText={errors[product._id]}
                        disabled={addProduct?.added}
                        onChange={e => {
                          const val = Number(e.target.value);
                          if (!Number.isNaN(val) && val > 0) {
                            setErrors({
                              ...errors,
                              [product._id]: ''
                            })
                          }
                          setAddProducts({
                            ...addProducts,
                            [product._id]: {
                              currentPrice: Number(e.target.value)
                            }
                          })
                        }}
                        type={'number'}
                        size={'small'}/>
                    </TableCell>
                    <TableCell>
                      {addProduct && addProduct.loading && (
                        <CircularProgress />
                      )}
  
                      {(!addProduct || !addProduct.loading) && !addProduct?.added && (
                        <Fab
                          onClick={() => {
                            handleClickAdd(product._id);
                          }}
                          color={'info'}>
                          <AddIcon />
                        </Fab>
                      )}
  
                      {addProduct?.added && (
                        <Button color={'success'}>Added</Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {searched && searchedProducts.length === 0 && (
            <Alert style={{
              textAlign: 'center'
            }} color={'warning'} icon={false} >
              No Matched Products
            </Alert>
          )}
        </TableContainer>
        )}
      </Box>
    )
  }