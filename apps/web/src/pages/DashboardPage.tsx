import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { StockGauge } from '../components/common/StockGauge';

import {
  Users,
  AlertTriangle,
  FileCheck2,
  Clock,
  TrendingUp,
  Plus,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


export const DashboardPage: React.FC = () => {

  const [summary, setSummary] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  useEffect(() => {

    const fetchData = async () => {

      setLoading(true);

      try {

        const [
          sumRes,
          trendRes,
          lowStockRes
        ] = await Promise.all([

          api.get('/api/dashboard/summary'),

          api.get('/api/dashboard/sales-trend?range=30d'),

          api.get('/api/products?lowStockOnly=true&pageSize=5')

        ]);


        setSummary(sumRes.data);

        setTrend(trendRes.data);

        setLowStockProducts(lowStockRes.data.data);


      } catch (err) {

        console.error(
          'Failed to load dashboard data',
          err
        );

      } finally {

        setLoading(false);

      }

    };


    fetchData();

  }, []);



  if (loading) {

    return (

      <div className="space-y-6">

        <div className="
          h-8 
          w-48 
          bg-indigo-200 
          animate-pulse 
          rounded
        " />

        <div className="
          grid 
          grid-cols-1 
          md:grid-cols-4 
          gap-4
        ">

          {
            [1,2,3,4].map((i)=>(

              <div
                key={i}
                className="
                  h-28
                  bg-white
                  rounded-xl
                  shadow-lg
                  animate-pulse
                "
              />

            ))
          }

        </div>

      </div>

    );

  }



  const kpiCards = [

    {

      title:'Active Customers',

      value:
        summary?.activeCustomersCount || 0,

      subtext:
        'Registered business accounts',

      icon:Users,

      color:
        'border-l-4 border-l-indigo-600',

      path:'/customers'

    },


    {

      title:'Low Stock Alerts',

      value:
        summary?.lowStockProductsCount || 0,

      subtext:
        'Products below min threshold',

      icon:AlertTriangle,

      color:
        'border-l-4 border-l-purple-600',

      path:'/products?lowStockOnly=true'

    },


    {

      title:"Today's Confirmed Sales",

      value:
        `₹${(summary?.todayConfirmedRevenue || 0).toLocaleString()}`,

      subtext:
        `${summary?.todayConfirmedChallansCount || 0} confirmed challan(s)`,

      icon:FileCheck2,

      color:
        'border-l-4 border-l-indigo-600',

      path:'/challans?status=Confirmed'

    },


    {

      title:'Pending Follow-Ups',

      value:
        summary?.pendingFollowUpsCount || 0,

      subtext:
        'Overdue or due today',

      icon:Clock,

      color:
        'border-l-4 border-l-purple-500',

      path:'/customers'

    }

  ];  return (

    <div className="
      space-y-8
      max-w-7xl
      mx-auto
    ">


      {/* PAGE HEADER */}

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
      ">


        <div>

          <h1 className="
            font-display
            font-bold
            text-2xl
            text-indigo-700
          ">

            Operations Dashboard

          </h1>


          <p className="
            text-gray-500
            text-sm
            font-sans
          ">

            Live metrics and wholesale ledger status.

          </p>


        </div>



        <button

          onClick={() =>
            navigate('/challans/new')
          }

          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            font-semibold
            rounded-lg
            text-sm
            transition
            shadow-md
          "

        >

          <Plus className="w-4 h-4"/>

          <span>
            New Delivery Challan
          </span>


        </button>


      </div>





      {/* KPI CARDS */}


      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-5
      ">


        {
          kpiCards.map(
            (kpi,idx)=>{

              const Icon = kpi.icon;


              return (

                <div

                  key={kpi.title}

                  onClick={() =>
                    navigate(kpi.path)
                  }


                  style={{
                    animationDelay:
                    `${idx*80}ms`
                  }}


                  className={`
                    bg-white
                    rounded-xl
                    shadow-lg
                    p-5
                    cursor-pointer
                    transition-all
                    duration-200
                    hover:shadow-xl
                    border
                    border-gray-100
                    ${kpi.color}
                  `}

                >


                  <div className="
                    flex
                    items-center
                    justify-between
                    text-gray-500
                  ">


                    <span className="
                      text-xs
                      font-mono
                      uppercase
                      tracking-wider
                    ">

                      {kpi.title}

                    </span>


                    <Icon className="
                      w-5
                      h-5
                      text-indigo-500
                    "/>


                  </div>





                  <div className="
                    mt-3
                    font-mono
                    font-bold
                    text-2xl
                    text-gray-900
                  ">


                    {kpi.value}


                  </div>




                  <p className="
                    mt-1
                    text-xs
                    text-gray-500
                  ">


                    {kpi.subtext}


                  </p>



                </div>


              );


            }
          )
        }


      </div>
            {/* SALES TREND + LOW STOCK SECTION */}


      <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-8
      ">



        {/* SALES CHART */}


        <div className="
          lg:col-span-2
          bg-white
          rounded-xl
          shadow-lg
          p-6
          border
          border-gray-100
        ">


          <div className="
            flex
            items-center
            justify-between
            mb-6
          ">


            <div>


              <h2 className="
                font-display
                font-bold
                text-lg
                text-indigo-700
                flex
                items-center
                gap-2
              ">


                <TrendingUp className="
                  w-5
                  h-5
                  text-indigo-600
                "/>


                30-Day Sales Trend


              </h2>



              <p className="
                text-xs
                text-gray-500
              ">

                Confirmed challan revenue over time

              </p>



            </div>


          </div>





          <div className="
            h-72
            w-full
            mt-6
          ">



            <ResponsiveContainer
              width="100%"
              height="100%"
            >


              <BarChart

                data={trend}

                margin={{
                  top:20,
                  right:20,
                  left:0,
                  bottom:20
                }}

              >



                <CartesianGrid
                  strokeDasharray="3 3"
                />



                <XAxis

                  dataKey="date"

                  tick={{
                    fontSize:11
                  }}

                  interval={4}

                />



                <YAxis

                  tick={{
                    fontSize:11
                  }}

                />




                <Tooltip


                  contentStyle={{

                    background:"#4f46e5",

                    borderRadius:"12px",

                    border:"none",

                    color:"#ffffff"

                  }}



                  formatter={(value:any)=>[

                    `₹${Number(value).toLocaleString()}`,

                    "Revenue"

                  ]}


                />





                <Bar


                  dataKey="revenue"


                  radius={[8,8,0,0]}


                  fill="#4f46e5"


                  animationDuration={1200}


                  cursor="pointer"


                />




              </BarChart>


            </ResponsiveContainer>



          </div>




          <div className="
            flex
            justify-between
            text-[11px]
            font-mono
            text-gray-500
            pt-2
            px-2
          ">


            <span>

              {trend[0]?.date}

            </span>



            <span>

              {trend[trend.length-1]?.date}

            </span>



          </div>



        </div>
                {/* LOW STOCK WATCHLIST */}


        <div className="
          bg-white
          rounded-xl
          shadow-lg
          p-6
          border
          border-gray-100
          flex
          flex-col
          justify-between
        ">



          <div>


            <div className="
              flex
              items-center
              justify-between
              mb-4
            ">



              <h2 className="
                font-display
                font-bold
                text-base
                text-indigo-700
                flex
                items-center
                gap-2
              ">


                <AlertTriangle className="
                  w-4
                  h-4
                  text-purple-600
                "/>


                Low Stock Alert


              </h2>




              <button

                onClick={() =>
                  navigate('/products?lowStockOnly=true')
                }


                className="
                  text-xs
                  font-mono
                  text-indigo-600
                  hover:underline
                  flex
                  items-center
                "

              >


                View all


                <ChevronRight className="
                  w-3
                  h-3
                "/>


              </button>



            </div>






            {
              lowStockProducts.length === 0 ? (


                <div className="
                  p-6
                  text-center
                  text-gray-500
                  text-sm
                  bg-indigo-50
                  rounded-lg
                  border
                  border-dashed
                  border-indigo-200
                ">


                  All inventory items are currently above minimum alert thresholds.


                </div>



              ) : (



                <div className="
                  divide-y
                  divide-gray-200
                ">



                  {
                    lowStockProducts.map((p)=>(


                      <div

                        key={p.id}

                        onClick={() =>
                          navigate(`/products/${p.id}`)
                        }


                        className="
                          py-3
                          hover:bg-indigo-50
                          px-2
                          rounded-lg
                          cursor-pointer
                          transition
                        "

                      >




                        <div className="
                          flex
                          justify-between
                          items-start
                          mb-1
                        ">



                          <span className="
                            font-medium
                            text-xs
                            text-gray-900
                            line-clamp-1
                          ">


                            {p.name}


                          </span>




                          <span className="
                            font-mono
                            text-[11px]
                            text-gray-500
                          ">


                            [{p.sku}]


                          </span>



                        </div>





                        <StockGauge

                          currentStock={p.currentStock}

                          minStockAlert={p.minStockAlert}

                          showIcon={false}

                        />



                      </div>



                    ))
                  }



                </div>



              )
            }



          </div>





          <div className="
            mt-4
            pt-4
            border-t
            border-gray-200
          ">



            <button

              onClick={() =>
                navigate('/products')
              }


              className="
                w-full
                py-2
                bg-indigo-50
                hover:bg-indigo-100
                text-indigo-700
                font-medium
                text-xs
                rounded-lg
                transition
                flex
                items-center
                justify-center
                gap-1
              "

            >



              <span>

                Open Stock Ledger

              </span>



              <ArrowUpRight className="
                w-3.5
                h-3.5
              "/>



            </button>



          </div>




        </div>




      </div>


    </div>


  );


};