import { faCircleChevronLeft, faCircleChevronRight, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Dispatch, lazy, SetStateAction, useEffect, useMemo, useState } from 'react'

interface listItemProps {
    data: any
    RenderItem: (i: any) => React.JSX.Element
    totalCount: number,
    limit: number,
    setOffset: Dispatch<SetStateAction<number>>,
    isLoading: boolean,
    isChange?: string,
    isSearch?: string,
    title?: string
}

const CommonLoader = lazy(() => import('./commonLoading'))


const ListItem = ({ isChange, isLoading, setOffset, RenderItem, data, totalCount, limit, isSearch, title }: listItemProps) => {



    const [pageNumber, setPageNumber] = useState<{ id: string, label: number, selected: boolean }[]>([])

    const [selectedNumber, setSelectedNumber] = useState<{ id: string, label: number, selected: boolean } | null>(null)

    let totalPages = Math.ceil(totalCount / limit)


    useEffect(() => {
        handlePagination(totalCount ? totalCount : 0, limit ? limit : 0)

    }, [totalCount, limit, isChange])

    const handlePagination = (total: number, limit: number, selectedIndex?: number) => {
        if (total && limit) {
            let totalPage = total / limit
            totalPage = Math.ceil(totalPage)
            if (totalPage > 0) {
                let i = 1
                let temp = []
                let choose_INDEX = totalPage >= limit ? limit : totalPage
                while (i <= choose_INDEX) {
                    temp.push({ id: String(i), label: i, selected: selectedIndex ? i == selectedIndex : i == 1 })
                    i++
                }
                setPageNumber(temp)
                temp ? setSelectedNumber(temp.find((i) => i.selected) || null) : null
            }
        }
        else {

        }

    }

    const updateSelectedPagination = (selectedData: { id: string; label: number; selected: boolean }) => {
        let selectedIndex = selectedData.label;
        let moveNumbers = Math.floor(limit / 2); // Shift point
        let totalPages = Math.ceil(totalCount / limit); // Total pages
        let offsetNumbers = 0

        let startPage = Math.max(1, selectedIndex - moveNumbers);
        let endPage = Math.min(totalPages, selectedIndex + moveNumbers);
        // Ensure at least `limit` items are visible when possible
        if (endPage - startPage + 1 < limit) {
            if (startPage === 1) {
                endPage = Math.min(startPage + limit - 1, totalPages);
            } else if (endPage === totalPages) {
                startPage = Math.max(endPage - limit + 1, 1);
            }
        }

        let formattedPages = Array.from({ length: endPage - startPage + 1 }, (_, i) => ({
            id: String(startPage + i),
            label: startPage + i,
            selected: selectedIndex === startPage + i,
        }));
        setPageNumber(formattedPages);
        setSelectedNumber(formattedPages.find((i) => i.selected) || null)
        offsetNumbers = formattedPages.find((i) => i.selected)?.label || 0
        offsetNumbers = (offsetNumbers * limit) - limit
        setOffset(offsetNumbers)
    };

    const selectedNumberwhenCan = useMemo(() => {
        return selectedNumber
    }, [limit])

    console.log("selectedNumberwhenCan-->", selectedNumberwhenCan);


    return (
        <div> {/* Parent container */}


            {isLoading ?
                <div className='flex w-full h-screen justify-center items-center'>
                    <CommonLoader size='large' />
                </div>
                :
                <>
                    {
                        totalCount ? (
                            <div>
                                <div className='grid sm:grid-cols-2 max-sm:grid-cols-1  mb-15 mt-14'>
                                    {
                                        Array.isArray(data) ? data?.map((val, i: any) => (
                                            <RenderItem item={val} key={i} />
                                        )) : null
                                    }
                                </div>
                                <footer className="fixed top-0 max-sm:w-[90%] sm:w-full bottom-0 self-end bg-white h-12  p-0 ">

                                    <div className='h-10 flex justify-center items-center w-full'>
                                        <div className=" flex justify-center items-center">
                                            <p className='text-sm text-black font-medium px-2'>{`${selectedNumber?.label || 0} of ${totalPages || 0}`}</p>
                                        </div>
                                        <div className="flex items-centerjustify-center h-6">
                                            {<button className="flex items-center"
                                                onClick={() => {
                                                    if (selectedNumber) {
                                                        let moveNext = { ...selectedNumber }
                                                        let ischanges = false
                                                        if (moveNext.label <= totalPages && moveNext.label > 1) {
                                                            moveNext.label = moveNext.label - 1
                                                            ischanges = true
                                                        }
                                                        if (ischanges) {
                                                            updateSelectedPagination(moveNext)
                                                        }

                                                    }
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faCircleChevronLeft} className="text-gray-500" />
                                                {
                                                    window.innerWidth >= 450 &&
                                                    <p className="font-bold text-gray-800 px-2 text-sm">Previous</p>

                                                }
                                            </button>}
                                            <div className="flex">
                                                {pageNumber.map((val, index) => (
                                                    <div
                                                        onClick={() => {
                                                            setSelectedNumber(val)
                                                            updateSelectedPagination(val)
                                                        }
                                                        }
                                                        key={index}
                                                        className={`w-6 h-6 rounded-full ${val.selected ? "bg-primary" : "bg-white"
                                                            } flex items-center justify-center px-1 mx-1 cursor-pointer transition-all duration-0`}
                                                    >
                                                        <p className="font-bold text-black">{val.label || 0}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="flex items-center"
                                                onClick={() => {
                                                    if (selectedNumber) {
                                                        let moveNext = { ...selectedNumber }
                                                        let ischanges = false
                                                        if (moveNext.label < totalPages && moveNext.label >= 1) {
                                                            moveNext.label = moveNext.label + 1
                                                            ischanges = true
                                                        }
                                                        if (ischanges) {
                                                            updateSelectedPagination(moveNext)

                                                        }
                                                    }
                                                }
                                                }
                                            >
                                                {window.innerWidth >= 450 && <p className="font-bold text-gray-800 px-2 text-sm">Next</p>}
                                                <FontAwesomeIcon icon={faCircleChevronRight} className="text-gray-500" />
                                            </button>
                                        </div>
                                    </div>

                                </footer>
                            </div>) :
                            (
                                <div className=' flex justify-center items-center h-screen'>
                                    {
                                        isSearch ? <p className='text-black/60 font-medium text-[14px]'>{`No Match Found For`}<span className='font-bold  text-black text-[14px] px-3'>{`'${isSearch}'`}</span></p>
                                            : <div className='grid place-items-center gap-2 px-3'>
                                                <FontAwesomeIcon icon={faLayerGroup} className='text-primary' />
                                                <p className='text-black/80 font-medium capitalize text-center'>{`Looks Like You have Nothing in your list`}</p>
                                                <button type='button' className='px-5 py-1 rounded-xl border-2 border-primary'>
                                                    <p className='text-primary font-medium capitalize text-[14px]'>{`Add ${title}`}</p>
                                                </button>
                                            </div>
                                    }
                                </div>)
                    }

                </>
            }
            {<>{console.log("totalCount", totalCount, "isSearch", isSearch, "loading", isLoading)
            }</>}

        </div >
    )
}
export default ListItem
