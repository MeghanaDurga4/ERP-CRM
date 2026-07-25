import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import {api} from "../lib/api";
import {StatusPill} from "../components/common/StatusPill";
import {useAuth} from "../context/AuthContext";
import {FileText,Search,Plus,Eye,ChevronLeft,ChevronRight,Calendar,Building,PackageCheck,TrendingUp} from "lucide-react";

export const ChallansPage:React.FC=()=>{

const [challans,setChallans]=useState<any[]>([]);
const [meta,setMeta]=useState<any>({page:1,pageSize:10,total:0,totalPages:1});
const [search,setSearch]=useState("");
const [statusFilter,setStatusFilter]=useState("");
const [loading,setLoading]=useState(true);

const {hasRole}=useAuth();
const navigate=useNavigate();

const fetchChallans=async(page=1)=>{
setLoading(true);
try{
const params=new URLSearchParams();
params.set("page",String(page));
params.set("pageSize","10");
if(search)params.set("search",search);
if(statusFilter)params.set("status",statusFilter);

const res=await api.get(`/api/challans?${params.toString()}`);

setChallans(res.data.data);
setMeta(res.data.meta);

}catch(err){
console.error(err);
}finally{
setLoading(false);
}
};

useEffect(()=>{
fetchChallans(1);
},[search,statusFilter]);

return(
<div className="max-w-7xl mx-auto space-y-8">

<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 text-white shadow-2xl">

<div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl"/>

<div className="relative flex flex-col lg:flex-row justify-between gap-8">

<div>

<p className="uppercase tracking-[5px] text-xs font-mono text-white/60">
Dispatch Management
</p>

<h1 className="mt-3 text-4xl font-display font-bold">
Delivery Challans
</h1>

<p className="mt-3 max-w-xl text-white/80">
Manage wholesale dispatch documents, customer deliveries and invoice workflow.
</p>

<div className="flex flex-wrap gap-5 mt-8">

<div className="bg-indigo-300/20 backdrop-blur rounded-2xl px-6 py-4">
<FileText className="mb-3"/>
<p className="text-xs text-white/60">Total Challans</p>
<h2 className="text-3xl font-bold">{meta.total}</h2>
</div>

<div className="bg-indigo-300/20 backdrop-blur rounded-2xl px-6 py-4">
<PackageCheck className="mb-3"/>
<p className="text-xs text-white/60">Current Page</p>
<h2 className="text-3xl font-bold">{meta.page}</h2>
</div>

<div className="bg-indigo-300/20 backdrop-blur rounded-2xl px-6 py-4">
<TrendingUp className="mb-3"/>
<p className="text-xs text-white/60">Loaded Records</p>
<h2 className="text-3xl font-bold">{challans.length}</h2>
</div>

</div>

</div>

{hasRole("Admin","Sales")&&(
<button
onClick={()=>navigate("/challans/new")}
className="flex items-center justify-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold shadow-xl hover:bg-indigo-50 hover:scale-105 transition h-fit"
>
<Plus size={18}/>
Create Challan
</button>
)}

</div>

</div>


<div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 flex flex-col md:flex-row gap-5 justify-between">

<div className="relative w-full md:w-96">

<Search className="absolute left-4 top-3.5 text-slate" size={18}/>

<input
type="text"
placeholder="Search challan number or customer..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full pl-12 pr-4 py-3 rounded-xl bg-indigo-50 border border-gray-200 outline-none focus:ring-2 focus:ring-ledger"
/>

</div>


<select
value={statusFilter}
onChange={(e)=>setStatusFilter(e.target.value)}
className="px-5 py-3 rounded-xl bg-indigo-50 border border-gray-200 outline-none"
>
<option value="">All Status</option>
<option value="Draft">Draft</option>
<option value="Confirmed">Confirmed</option>
<option value="Cancelled">Cancelled</option>
</select>

</div>
{/* ================= CHALLAN TABLE ================= */}

<div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">

{loading?(
<div className="p-10 text-center text-slate font-medium">
Loading challan records...
</div>
):challans.length===0?(
<div className="p-12 text-center">

<FileText className="mx-auto text-slate-light mb-3" size={40}/>

<h3 className="text-xl font-bold text-ink">
No Challans Found
</h3>

<p className="text-sm text-slate mt-2">
Create a new delivery challan to start dispatch management.
</p>

</div>
):(

<div className="overflow-x-auto">

<table className="w-full">

<thead>

<tr className="bg-indigo-50 border-b border-gray-200 text-xs uppercase text-slate font-mono">

<th className="px-6 py-4 text-left">
Challan
</th>

<th className="px-6 py-4 text-left">
Customer
</th>

<th className="px-6 py-4 text-left">
Status
</th>

<th className="px-6 py-4 text-left">
Items
</th>

<th className="px-6 py-4 text-left">
Amount
</th>

<th className="px-6 py-4 text-left">
Created
</th>

<th className="px-6 py-4 text-right">
Action
</th>

</tr>

</thead>


<tbody className="divide-y divide-slate-border">


{challans.map((ch)=>(

<tr
key={ch.id}
className="hover:bg-indigo-50 transition"
>


<td className="px-6 py-5">


<div className="flex items-center gap-3">


<div className="h-10 w-10 rounded-xl bg-ledger-light flex items-center justify-center">

<FileText
size={18}
className="text-ledger"
/>

</div>


<div>


{ch.challanNumber?(

<p className="font-bold text-ledger font-mono">

{ch.challanNumber}

</p>

):(


<p className="font-bold text-amber italic">

Draft Pending

</p>

)}



<p className="text-xs text-slate">

ID: {ch.id}

</p>


</div>


</div>


</td>





<td className="px-6 py-5">


<div className="flex items-center gap-3">


<div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">

<Building
size={18}
className="text-slate"
/>

</div>


<div>

<p className="font-semibold text-ink">

{ch.customer?.name}

</p>


<p className="text-xs text-slate">

{ch.customer?.businessName}

</p>


</div>


</div>


</td>






<td className="px-6 py-5">

<StatusPill status={ch.status}/>

</td>







<td className="px-6 py-5">


<div className="font-mono text-sm text-ink">

{ch.items?.length || 0} Items

</div>


<p className="text-xs text-slate">

{ch.totalQuantity} Units

</p>


</td>








<td className="px-6 py-5">


<p className="font-bold text-lg text-ink font-mono">

₹{Number(ch.totalAmount).toFixed(2)}

</p>


<p className="text-xs text-slate">

Total Value

</p>


</td>







<td className="px-6 py-5">


<div className="flex items-center gap-2 text-sm text-slate font-mono">


<Calendar size={15}/>


{new Date(ch.createdAt).toLocaleDateString()}


</div>


</td>







<td className="px-6 py-5 text-right">


<button

onClick={()=>navigate(`/challans/${ch.id}`)}

className="
inline-flex
items-center
gap-2
px-4
py-2
rounded-xl
bg-ledger-light
text-ledger
font-semibold
text-sm
hover:bg-ledger
hover:text-white
transition
"

>


<Eye size={16}/>

View

</button>


</td>




</tr>


))}


</tbody>


</table>


</div>

)}


</div>
{/* ================= PAGINATION ================= */}

<div className="p-5 bg-indigo-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">

<div className="text-sm text-slate font-mono">

Showing Page 
<span className="font-bold text-ink">
 {meta.page}
</span>
{" "}of{" "}
<span className="font-bold text-ink">
{meta.totalPages}
</span>

<span className="ml-2">
({meta.total} records)
</span>

</div>


<div className="flex items-center gap-3">


<button

disabled={meta.page<=1}

onClick={()=>fetchChallans(meta.page-1)}

className="
flex
items-center
justify-center
h-10
w-10
rounded-xl
bg-white
border
border-gray-200
hover:bg-ledger-light
hover:text-ledger
disabled:opacity-40
transition
"

>

<ChevronLeft size={18}/>

</button>




<div className="
px-4
py-2
rounded-xl
bg-ledger
text-white
font-bold
font-mono
"

>

{meta.page}

</div>





<button

disabled={meta.page>=meta.totalPages}

onClick={()=>fetchChallans(meta.page+1)}

className="
flex
items-center
justify-center
h-10
w-10
rounded-xl
bg-white
border
border-gray-200
hover:bg-ledger-light
hover:text-ledger
disabled:opacity-40
transition
"

>

<ChevronRight size={18}/>

</button>



</div>


</div>



</div>

);

};