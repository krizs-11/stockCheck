import backgroundpot from '../assets/bg1.jpg'
import backgroundpot2 from '../assets/bg2.jpg'
import backgroundpot3 from '../assets/bg3.jpg'
import backgroundpot4 from '../assets/back1.jpg'

import profilePh1 from '../assets/pf1.jpg'
import profilePh2 from '../assets/pf2.jpg'
import profilePh3 from '../assets/pf3.jpg'
import profilePh4 from '../assets/pf4.jpg'
import profilePh5 from '../assets/pf5.jpg'
import profilePh6 from '../assets/pf6.jpg'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendUp, faBars, faBasketShopping, faBoxesPacking, faBoxOpen, faCheck, faCircleChevronLeft, faCircleChevronRight, faGear, faShield, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FadeInOnScroll from '../components/fadeInOnScroll'

export default function Home() {

    const carosuelImages = [
        {
            id: '1',
            Title: 'Stay on top of your inventory with real-time updates',
            subTitle: 'Simplify stock tracking across all your warehouses.',
            imageData: backgroundpot
        },
        {
            id: '2',
            Title: 'Stay on top of your inventory with real-time updates',
            subTitle: 'Simplify stock tracking across all your warehouses.',
            imageData: backgroundpot2

        }, {
            id: '3',
            Title: 'Stay on top of your inventory with real-time updates',
            subTitle: 'Simplify stock tracking across all your warehouses.',
            imageData: backgroundpot3

        }, {
            id: '4',
            Title: 'Stay on top of your inventory with real-time updates',
            subTitle: 'Simplify stock tracking across all your warehouses.',
            imageData: backgroundpot4
        }
    ]

    const cardData = [
        {
            id: '1',
            Title: 'production and assembly',
            subTitle: 'detail on production processes , assembly capacity and product types',
            icon: faBasketShopping
        },
        {
            id: '2',
            Title: 'custom manfacturing',
            subTitle: 'custom product creation with design and customization changes',
            icon: faBoxOpen

        }, {
            id: '3',
            Title: 'quality control',
            subTitle: 'procedures and systems in place to ensure high product quality',
            icon: faGear

        }, {
            id: '4',
            Title: 'techology and innovation',
            subTitle: 'details on the lastest manufacturing technologies  and ongoing innovations',
            icon: faShield
        },
        {
            id: '5',
            Title: 'packaging and logistics',
            subTitle: 'packaging and logistics for shiiping to customers and distributors',
            icon: faBoxesPacking
        },
        {
            id: '6',
            Title: 'consultinga nd matket research ',
            subTitle: 'services to help companies and provide strategic advice',
            icon: faArrowTrendUp
        }
    ]

    const staffData = [
        {
            "name": "Bob Smith",
            "role": "Backend Developer",
            pf: profilePh1
        },
        {
            "name": "Carol Martinez",
            "role": "UI/UX Designer",
            pf: profilePh2
        },
        {
            "name": "David Lee",
            "role": "DevOps Engineer",
            pf: profilePh3
        },
        {
            "name": "Eva Zhang",
            "role": "Project Manager",
            pf: profilePh4
        },
        {
            "name": "Frank Wright",
            "role": "Quality Assurance Engineer",
            pf: profilePh5
        },
        {
            "name": "Grace Kim",
            "role": "Full Stack Developer",
            pf: profilePh6
        },

    ]

    // const [activeIndex, setActiveIndex] = useState(0)


    const scrollRefs = useRef<HTMLDivElement>(null);

    const cardRef = useRef<HTMLDivElement>(null)

    const containerRef = useRef<(HTMLDivElement | null)[]>([])

    const [bgLoaded, setBgLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = backgroundpot2;
        img.onload = () => setBgLoaded(true);
    }, []);


    // const handleDotClick = (index: number) => {
    //     const container = cardRef.current;
    //     if (container) {
    //         const width = container.offsetWidth;
    //         container.scrollTo({
    //             left: index * width,
    //             behavior: 'smooth',
    //         });
    //         setActiveIndex(index);
    //     }
    // };

    const currentrefIndex = useRef(0)

    useEffect(() => {
        let index = 0;
        let direction = 1;

        const imgCaros = setInterval(() => {
            const container = cardRef.current;
            if (!container) return;

            const WIDTH = container.offsetWidth;

            // Scroll to calculated position
            container.scrollTo({ left: WIDTH * index, behavior: 'smooth' });

            // Update index & direction
            if (index === carosuelImages.length - 1) {
                direction = -1;
            } else if (index === 0) {
                direction = 1; // ← this was 0 in your code
            }

            index += direction;
            currentrefIndex.current = index
            // setActiveIndex(index)
        }, 2000); // increased time to 2s for better UX

        return () => clearInterval(imgCaros);
    }, [carosuelImages.length]);

    useEffect(() => {
        const container = cardRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const slideWidth = container.offsetWidth;

            Math.round(scrollLeft / slideWidth);
            // setActiveIndex(index);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = (direction: 'right' | 'left') => {
        const container = scrollRefs.current;
        const cardWidth = cardRef.current?.offsetWidth || 850; // default desktop width
        const screenWidth = window.innerWidth;

        const scrollAmount = screenWidth < 768 ? (cardWidth + 16) : 850; // mobile vs desktop

        container?.scrollBy({
            left: direction === 'right' ? scrollAmount : -scrollAmount,
            behavior: 'smooth'
        });
    };

    const handleContainerScroll = (index: number) => {
        containerRef.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'end' })
        setActiveTab(index)
    }
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState(0)

    return (
        <div className='flex flex-col w-full bg-white items-center'>
            {/* Fixed Header */}
            <>
                {/* Desktop Header */}
                <header className="hidden md:flex w-[70%] fixed bg-[#f9f9f9]/50 justify-between px-5 items-center my-3 z-50 backdrop-blur-md border border-[#f9f9f9]/50 shadow-lg rounded-3xl">
                    <div className="flex flex-col text-black font-bold justify-center items-center">
                        <FontAwesomeIcon icon={faCheck} className="text-primary text-3xl" />
                        <p className="px-5">STOCK <span className="text-black">CHECK</span></p>
                    </div>
                    <nav className="flex font-bold text-gray-500 capitalize list-none w-[40%] justify-between items-center cursor-pointer">
                        <li className={`hover:text-primary ${activeTab == 0 ? 'text-primary' : ''}`} onClick={() => {
                            handleContainerScroll(0)
                        }
                        }>Home</li>
                        <li className={`hover:text-primary ${activeTab == 1 ? 'text-primary' : ''}`}
                            onClick={() => {
                                handleContainerScroll(1)
                            }
                            }>Work</li>
                        <li className={`hover:text-primary ${activeTab == 2 ? 'text-primary' : ''}`}
                            onClick={() => {
                                handleContainerScroll(2)
                            }
                            }>About Us</li>
                        <li className={`hover:text-primary ${activeTab == 3 ? 'text-primary' : ''}`}
                            onClick={() => {
                                handleContainerScroll(3)
                            }
                            }>Team</li>
                    </nav>
                    <button className="bg-primary rounded-xl px-5 text-[14px] font-bold h-10 hover:bg-primary/80" onClick={() => {
                        navigate('/signIn')
                    }
                    }>
                        <p>Sign In</p>
                    </button>
                </header>

                {/* Mobile Hamburger Icon */}
                <div className="md:hidden z-50 flex w-full px-5 py-2 justify-between items-center bg-primary">
                    <div className="flex flex-col items-center text-gray-100">
                        <FontAwesomeIcon icon={faCheck} className="text-primary text-4xl text-white" />
                        <p className="text-xl font-bold">STOCK <span className="text-white">CHECK</span></p>
                    </div>

                    <FontAwesomeIcon
                        icon={isOpen ? faTimes : faBars}
                        className={`text-3xl ${isOpen ? 'text-gray-300' : 'text-gray-100'} cursor-pointer`}
                        onClick={() => setIsOpen(!isOpen)}
                    />

                </div>

                {/* Mobile Modal */}
                {isOpen && (
                    <div
                        style={{
                            animation: 'fadeUp 0.4s ease-out',
                        }}
                        className="md:hidden fixed top-0 left-0 w-full h-full bg-white/80 z-40 flex flex-col items-center gap-6 justify-center">
                        <nav className="flex flex-col items-center gap-4 text-lg text-gray-600 font-semibold list-none">
                            <li className="hover:text-primary ">Home</li>
                            <li className="hover:text-primary">Work</li>
                            <li className="hover:text-primary">About Us</li>
                            <li className="hover:text-primary">Contact Us</li>
                        </nav>
                    </div>
                )}
            </>

            {/* firstConatiner */}
            <div
                ref={(el) => {
                    containerRef.current[0] = el
                }
                }
                className='w-full h-screen overflow-hidden relative'>
                <div className="w-full h-full flex bg-gray-200">
                    <div
                        className={` bg-gray-50 min-w-full h-screen bg-center bg-cover transition-opacity duration-700 ease-in ${bgLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        style={bgLoaded ? { backgroundImage: `url(${backgroundpot4})` } : {}}
                    >
                        <div className='w-full h-full flex'>
                            <div className='sm:w-[50%] w-[100%]  flex h-full justify-self-start items-center'>
                                <div className='w-full text-gray-800 flex flex-col items-center  h-screen justify-center px-5'>
                                    <p className={`sm:text-5xl text-2xl font-bold capitalize fade-up delay-300`}>Simplify stock tracking across all your warehouses.</p>
                                    <p className='sm:text-5xl text-xl font-light capitalize py-2 fade-up delay-500'>Stay on top of your inventory with real-time updates</p>
                                    <p className='sm:text-2xl  text-[20px] font-meduim capitalize fade-up delay-700 text-gray-100'>Make smarter decisions with data-driven insights.</p>
                                    <div className='sm:flex-row flex flex-col sm:my-3 items-center mt-10 w-full px-5 py-3'>
                                        <button className='bg-primary rounded-xl px-7 py-2 text-xl font-medium m-0 flex justify-center items-center sm:w-[50%] w-[85%] text-gray-100 hover:bg-amber-400' onClick={() => {
                                            navigate('/signIn')
                                        }
                                        }>
                                            <p>Get Started</p>
                                        </button>
                                        <button className='bg-white rounded-xl px-7 py-2 text-xl font-light mx-2 text-gray-600 sm:w-[70%] justify-center items-center w-[85%] sm:mt-0 mt-5 hover:bg-gray-100'>
                                            <p>Our Platform</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ))} */}
                </div>
            </div>

            {/* secondConatiner */}
            <FadeInOnScroll>

                <div
                    ref={(el) => {
                        containerRef.current[1] = el
                    }
                    }
                    className='bg-amber-500 w-full flex flex-col items-center capitalize'>
                    <div className='p-5 w-full sm:flex-row flex flex-col items-center justify-self-center capitalize'>
                        <p className='text-2xl font-bold capitalize'>Efficient and integrated manufacturing services</p>
                        <p className='text-xl font-light px-5'> Simply operations with our efficient quality focused services</p>
                    </div>
                    <div className='sm:flex-row flex flex-col w-[95%] justify-between sm:flex-wrap items-center py-5'>
                        {
                            cardData.map((item, index) =>
                            (
                                <div key={index} className='group sm:w-[32%] w-[95%] bg-amber-500 shadow-2xl backdrop-blur-2xl my-2 px-3 py-4  text-white capitalize rounded-xl  hover:bg-black transition-all duration-300 ease-in'>
                                    <div className='py-5 group-hover:translate-x-[90%] transition-transform duration-300 ease-in'>
                                        <FontAwesomeIcon icon={item.icon} />
                                    </div>
                                    <p className='font-bold text-xl  fade-up delay-100 group-hover:-translate-y-12 transition-transform duration-100 ease-in'>{item.Title}</p>
                                    <p className='font-light text-xl fade-up delay-700'>{item.subTitle}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </FadeInOnScroll>

            {/* thirdConatiner */}
            <div
                className='w-full bg-white px-5 py-4 flex flex-col justify-center items-center'>
                <div className="marquee-container bg-white">
                    <div className="marquee text-xl text-black font-light flex whitespace-nowrap">
                        <span className="flex items-center gap-2">
                            <span><i className="fas fa-boxes-stacked" ></i> Fast inventory management</span>
                            <span><i className="fas fa-sync-alt"></i> Live stock updates</span>
                            <span><i className="fas fa-chart-line"></i> Smart reporting</span>
                            <span><i className="fas fa-truck"></i> Track orders in real time</span>
                            <span><i className="fas fa-leaf"></i> Reduce waste</span>
                        </span>
                        {/* Duplicate to create seamless loop */}
                        <span className="flex items-center gap-2 ">
                            <span><i className="fas fa-boxes-stacked"></i> Fast inventory management</span>
                            <span><i className="fas fa-sync-alt"></i> Live stock updates</span>
                            <span><i className="fas fa-chart-line"></i> Smart reporting</span>
                            <span><i className="fas fa-truck"></i> Track orders in real time</span>
                            <span><i className="fas fa-leaf"></i> Reduce waste</span>
                        </span>
                    </div>
                </div>

            </div>

            {/* fourthConatiner */}
            <div ref={(el) => {
                containerRef.current[2] = el

            }
            } className='w-full bg-gray-100 sm:flex-row flex flex-col'>
                <div className='flex flex-col sm:w-[50%] w-full items-center relative'>
                    {/* SCROLLABLE SLIDE AREA */}
                    <div
                        ref={cardRef}
                        className='flex overflow-x-auto scroll-smooth w-full scrollbar-hidden'
                    >
                        {carosuelImages.map((item, index) => (
                            <div key={index} className='min-w-full object-cover contrast-120'>
                                <img src={item.imageData} className='w-full h-auto' alt={`carousel-${index}`} />
                            </div>
                        ))}
                    </div>

                    {/* DOT NAVIGATION (NOT SCROLLABLE) */}
                    {/* <div className='flex px-5 py-2 gap-2 absolute mt-[60%]'>
                        {Array.from({ length: carosuelImages.length }).map((_, index) => (
                            <FontAwesomeIcon
                                key={index}
                                icon={faDotCircle}
                                className={`cursor-pointer transition-all duration-300 ${activeIndex === index ? 'text-primary scale-110' : 'text-gray-400'
                                    }`}
                                onClick={() => handleDotClick(index)}
                            />
                        ))}
                    </div> */}
                </div>


                <div className=' sm:w-[50%] w-full bg-black flex flex-col justify-center items-center px-5 py-3 font-bold  capitalize'>
                    <p className='py-4 text-3xl text-gray-100'> from idea to production days</p>
                    <p className='font-light text-xl py-5'>accelrate your production with our technology reduce downtime nd optimize costs get a special offer now</p>
                    <button className='bg-white rounded-xl px-5 text-[14px] font-bold m-0 h-10 text-black hover:bg-gray-100'>
                        <p>Work With Us</p>
                    </button>
                </div>

            </div>

            <div
                ref={(el) => {
                    containerRef.current[3] = el
                }
                }
                className='w-full bg-[#f5f5f5] flex flex-col justify-center px-5 py-3 font-bold  capitalize'>
                <p className='py-4 text-3xl text-gray-700 text-center capitalize'> our dedicated team</p>
                <div className="w-full flex justify-center items-center py-2">
                    <div ref={scrollRefs} className="flex overflow-x-auto gap-6 px-4 sm:w-[60%] w-[90%] scrollbar-hidden">
                        {staffData.map((item, index) => (
                            <div
                                key={index} className="sm:min-w-[240px]  min-w-[300px] bg-white rounded-xl p-4">
                                <img
                                    src={item.pf}
                                    alt={item.name}
                                    className="w-full h-70 object-cover mb-2 hover:scale-90  duration-100 rounded-2xl transition-shadow "
                                />
                                <div>
                                </div>
                                <p className="text-lg font-semibold text-gray-700 ">{item.name}</p>
                                <p className="text-sm text-gray-400">{item.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex w-full justify-center items-center py-4'>
                    <FontAwesomeIcon
                        icon={faCircleChevronLeft}
                        className='text-gray-500 cursor-pointer'
                        onClick={() => {
                            handleScroll('left')
                        }}
                    />
                    <FontAwesomeIcon
                        icon={faCircleChevronRight}
                        className='text-gray-500 px-5 cursor-pointer'
                        onClick={() => {
                            handleScroll('right')
                        }}
                    />
                </div>
            </div>
            {/*fifth conatiner  */}



            {/*sixth conatiner  */}
            <footer className='w-full bg-black sm:flex-row flex flex-col justify-between px-3 py-5 items-center'>
                <div className='flex flex-col justify-center items-center'>
                    <div className='flex flex-col text-white font-bold justify-center items-center'>
                        <FontAwesomeIcon icon={faCheck} className='text-primary text-3xl' />
                        <p className='px-5'>STOCK <span className='text-white'>CHECK</span></p>
                    </div>
                    <div>
                        <p>our solutions make productions  faster and cheaper contact us for more information </p>
                    </div>


                </div>
                <div className='font-light text-gray-400'>
                    <p> &copy; 2025 Stock Check all Rights Reserved</p>
                </div>
            </footer>

        </div>)
}
