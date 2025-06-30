import { useContext, useEffect, useRef, useState, lazy } from 'react'
// import CommonHeader from '../components/commonHeader'
// import ListItem from '../components/commonList'
import ProductService from '../services/components/productService'
import { AppContext } from '../context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronLeft, faChevronRight, faFilter, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useDebounce } from '../customHooks/useDebounce'
import CommonDialogBox from '../components/commonDialogBox'
import { CommonToast } from '../services/toastService'
// import AddEditProduct from './addEditProduct'
// import Modal from '../components/commonModal'

const AddEditProduct = lazy(() => import('./addEditProduct'))
const CommonHeader = lazy(() => import('../components/commonHeader'))
const ListItem = lazy(() => import('../components/commonList'))
const Modal = lazy(() => import('../components/commonModal'))



type ProductDetail = {
    id: string;
    productCategory: string;
    productName: string;
    price: number;
    quantity: number;
    quantityType: string;
    stockHistoryExist: boolean;
    stockDate: string; // Can be `Date` if parsed
};

type ApiResponse = {
    success: boolean;
    message: string;
    count: number;
    productDetails: ProductDetail[];
};
let limit = 10
export default function Product() {

    // const navigate = useNavigate()
    // const isFocus = useLocation()
    const [searchValue, setSearchValue] = useState('')
    const { storeId, userDetails, extendTab } = useContext(AppContext)
    const [productList, setProductList] = useState<ApiResponse | null>(null)
    const [offsetValues, setOffsetValues] = useState(0)
    const [productCategory, setProductCategory] = useState<{
        id: number;
        label: string;
        selected: boolean;
    }[]>([])

    const [sortList, setSortList] = useState([
        {
            id: '1',
            name: 'A-Z',
            selected: false,
            key: 'ASC'
        },
        {
            id: '2',
            name: 'Z-A',
            selected: false,
            key: 'DESC'
        },
        {
            id: '3',
            name: 'New',
            selected: false,
            key: 'NEW'
        },
        {
            id: '4',
            name: 'old',
            selected: false,
            key: 'OLD'
        },

    ])

    const categoryRef = useRef<(HTMLDivElement | null)[]>([]);

    const [isLoading, setIsLoading] = useState(true)

    const [selectedIndex, setSelctedIndex] = useState(0)

    const [sortVisible, setSortVisible] = useState(false)

    const [selectedSort, setSelectedSort] = useState('')

    const [selectedFilter, setSelectedFilter] = useState('')

    const [addProductOpen, setAddProductOpen] = useState(false)

    let value = useDebounce({ value: searchValue, delay: 100 })

    const [selectedProductId, setSelectedProductId] = useState('0')

    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        if (!addProductOpen) {
            setSelectedProductId('0')
            setIsLoading(true)
            getAllProducts()
        }
    }, [selectedSort, value, offsetValues, selectedFilter, addProductOpen])


    useEffect(() => {
        if (userDetails) {
            let formatData = userDetails.productCategory?.map((val, index: number) => {
                return {
                    id: index + 1,
                    label: val,
                    selected: false
                }
            })
            setProductCategory(formatData)
        }
    }, [userDetails])

    const getAllProducts = async () => {
        let data =
        {
            search: searchValue,
            filter: selectedFilter,
            limit: limit,
            offset: offsetValues,
            sort: selectedSort
        }
        await ProductService.getAllProductData(storeId, data)
            .then((res: ApiResponse) => {
                if (res) {
                    setProductList(res);
                }
            })
            .catch((error) => {
                console.log("error in getAllProducts-->", error);
            }).finally(() => {
                setIsLoading(false)
            })
    }

    const deleteProduct = async () => {
        try {
            ProductService.getOneProductDeleteData(storeId, selectedProductId).then((res) => {
                if (res) {
                    CommonToast.show({ type: 'success', message: 'Product deleted Successfully' })
                    getAllProducts()
                    setOffsetValues(0)
                }
            })
        }
        catch (error) {
            console.log("error in deleteProduct-->", error);
        }
    }

    const RenderItem = (data: { item: ProductDetail }) => {
        return (
            <div
                className="bg-white sm:w-[90%] max-sm:w-[90%] my-2 mx-3 grow transition ease-in duration-200 flex-col justify-between py-2 px-2 rounded-2xl">
                <div className='flex justify-between items-center'>

                    <div className='sm:w-[20%] max-sm:w-[30%]'>
                        <div className='flex items-center'>
                            <p className='text-gray-500  font-medium sm:text-sm  xl:text-[14px]  capitalize'>name</p>
                            <div className=' bg-amber-300 mx-2 rounded-xl max-sm:opacity-0 '>
                                <p className='text-black font-mono text-[12px] px-2 '>{data?.item?.productCategory}</p>
                            </div>
                        </div>
                        <p className='text-black font-bold sm:text-sm  xl:text-[14px]  capitalize'>{data?.item?.productName}</p>
                    </div>

                    <div >
                        <p className='text-gray-400 capitalize font-medium text-[14px]'>price</p>
                        <p className='text-gray-800 font-bold text-[14px] lowercase'>{`₹${data?.item?.price}`}</p>
                    </div>

                    <div >
                        <p className='text-gray-400 capitalize font-medium text-[14px]'>quantity</p>
                        <p className='text-black font-bold'>{data?.item?.quantity}<sub className='px-1 font-bold text-black/50'>{data?.item?.quantityType}</sub></p>
                    </div>

                    <div className=' sm:w-[10%] max-sm:w-[15%] items-center justify-between'>
                        <p className='text-black/50 font-medium text-[14px]'>Action</p>
                        <div className='flex justify-between items-center' >
                            <button type='button' onClick={() => {
                                setSelectedProductId(data.item.id)
                                setAddProductOpen(true)
                            }}>
                                <FontAwesomeIcon icon={faPencil} className='text-black' />
                            </button>

                            <button onClick={() => {
                                setOpenDialog(true)
                                setSelectedProductId(data.item.id)
                            }}>
                                <FontAwesomeIcon icon={faTrash} className='text-red-500' />

                            </button>
                        </div>
                    </div>

                </div>
                <div>
                    {window.innerWidth <= 450 && <div className='  mx-2 rounded-xl sm:opacity-1  capitalize justify-self-center'>
                        <p className='text-primary font-mono text-[12px] px-2  capitalize'>{data?.item?.productCategory}</p>
                    </div>
                    }
                </div>
            </div>
        )
    }

    const scrollToCategory = (index: number) => {
        setTimeout(() => {
            const targetElement = categoryRef.current[index];
            targetElement?.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start' });
        }, 10)
    };

    const sortListRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortListRef.current && !sortListRef.current.contains(event.target as Node)) {
                setSortVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (

        <div className='w-full flex-1 relative'
            onClick={() => {
                if (sortVisible) {
                    setSortVisible(false)
                }
            }
            }>

            <CommonHeader
                name='Product'
                isSearch={true}
                onChangeText={(val) => {
                    setSearchValue(val)
                    if (offsetValues) {
                        setOffsetValues(0)
                    }
                }
                }
                searchvalue={searchValue}
                setSearchValue={setSearchValue}
                onClickButton={() => {
                    setSelectedProductId('0')
                    setAddProductOpen(true)
                    console.log("calling");

                }
                }
            />

            <div className={`flex fixed items-center self-center ${extendTab ? 'sm:w-[85%]' : 'sm:w-[95%]'} max-sm:w-[86%] ml-1 bg-white rounded-xl mt-2 border border-gray-100 transition-all duration-500 ease-in-out`}>
                <div className="flex items-center justify-between px-3 py-1 max-sm:w-[70%] sm:w-[95%] rounded-4xl self-center my-1 mx-0.5">

                    <div
                        className={`transition-all ease-in-out duration-200`}
                        onClick={() => {
                            scrollToCategory(selectedIndex - 1)
                            setSelctedIndex(selectedIndex - 1)
                        }
                        }>
                        <FontAwesomeIcon icon={faChevronLeft} className='text-gray-700' />
                    </div>


                    <div className="flex overflow-x-auto whitespace-nowrap scroll-smooth  scrollbar-hidden sm:w-[90%] max-sm:w-[90%] z-30 ">
                        {productCategory?.map((i, index: number) => (
                            <div
                                key={index}
                                ref={(el) => { categoryRef.current[index] = el; }}
                                onClick={() => {
                                    setSelctedIndex(index)
                                    scrollToCategory(index)
                                    setProductCategory((prev) => {
                                        return prev.map((values) => {
                                            return {
                                                ...values,
                                                selected: values.label == i.label ? !values.selected : false
                                            }

                                        })

                                    })
                                    if (i.selected) {
                                        setSelectedFilter('')
                                    }
                                    else {
                                        setSelectedFilter(i.label)
                                    }
                                }
                                }
                                className={`flex items-center  cursor-pointer px-3 ${i.selected ? ' bg-white border-black' : 'border-gray-300'} border-[1px] mx-2 rounded-xl h-7`}
                            >
                                <p className="text-black font-bold text-[12px] capitalize">{i.label}</p>
                            </div>
                        ))}
                    </div>

                    <div
                        onClick={() => {
                            scrollToCategory(selectedIndex + 1)
                            setSelctedIndex(selectedIndex + 1)
                        }
                        }
                    >
                        <FontAwesomeIcon icon={faChevronRight} className='text-gray-700' />
                    </div>



                </div >

                <div className="px-5" onClick={() => {
                    console.log("helloo sort")
                }
                }>
                    <div
                        className="px-2 bg-gray-100  cursor-pointer h-6"
                        onClick={() => {
                            setSortVisible((prev) => !prev)
                        }}
                    >
                        <FontAwesomeIcon icon={faFilter} className="text-black " />
                    </div>

                    <div
                        className={`absolute right-3 mt-3 w-[90px] bg-white transition-all duration-500 ease-in-out overflow-hidden rounded-b-md shadow-lg 
                   ${sortVisible ? "max-h-40 opacity-100 scale-100" : "max-h-0 opacity-0"}`}>
                        {sortList.map((values, index) => (
                            <div
                                key={index}
                                className="flex px-2 py-1 cursor-pointer hover:bg-gray-200 transition-colors items-center "
                                onClick={() => {
                                    setSortList((prev) =>
                                        prev.map((item) => ({
                                            ...item,
                                            selected: item.name === values.name ? !item.selected : false,
                                        }))
                                    );
                                    setSelectedSort(values?.selected ? '' : values.key)
                                    setSortVisible(false)
                                }}
                            >
                                <p
                                    className={`text-gray-500 text-sm font-medium ${values.selected ? "text-black font-bold text-[11px]" : "text-[11px] text-gray-400"
                                        }`}
                                >
                                    {values.name}
                                </p>
                                {values.selected && (
                                    <FontAwesomeIcon icon={faCheck} className="text-black text-[10px] ml-1" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className=''>
                < ListItem
                    title='Product'
                    limit={limit}
                    data={productList?.productDetails ? productList?.productDetails : []}
                    RenderItem={RenderItem}
                    totalCount={productList?.count ? productList?.count : 0}
                    setOffset={setOffsetValues}
                    isLoading={isLoading}
                    isChange={selectedFilter}
                    isSearch={productList?.count ? '' : searchValue ? searchValue : selectedFilter}
                />
            </div>


            {addProductOpen && <Modal
                RenderItem={() =>
                    <AddEditProduct
                        setOpen={setAddProductOpen}
                        productId={selectedProductId}
                        open={addProductOpen}
                        setSelectedProductId={setSelectedProductId}
                    />}
                open={addProductOpen}
                setOpen={setAddProductOpen}
                isSubScreen
            />}




            {openDialog && <Modal
                RenderItem={() =>
                    <CommonDialogBox
                        iconkey='PR'
                        name='Product'
                        setClose={setOpenDialog}
                        onClickDialog={(val) => {
                            if (val == '1') {
                                deleteProduct()
                            }
                            else {
                                setSelectedProductId('0')
                            }
                        }
                        }
                    />
                }
                open={openDialog}
                setOpen={setOpenDialog}
            />}

        </div >
    )
}
