import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  Plus,
  Shield,
  UserX,
  CheckCircle,
  Users,
  UserCheck,
  UserCog,
  Activity,
} from "lucide-react";

export const UsersPage: React.FC = () => {

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Sales",
  });


  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await api.get("/api/users");
      setUsers(res.data.data);

    } catch (err) {
      console.error(err);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);



  const handleCreateSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError(null);

    try {

      await api.post("/api/users", form);

      setIsCreateOpen(false);

      setForm({
        name:"",
        email:"",
        password:"",
        role:"Sales"
      });

      fetchUsers();

    } catch(err:any){

      setError(
        err.response?.data?.message ||
        "Failed to create user"
      );

    }

  };



  const handleDeactivate = async(userId:string)=>{

    try{

      await api.patch(
        `/api/users/${userId}/deactivate`
      );

      fetchUsers();

    }catch(err:any){

      setError(
        err.response?.data?.message ||
        "Failed to deactivate user"
      );

    }

  };



return (

<div className="max-w-7xl mx-auto space-y-8 font-sans">


{/* HEADER */}

<div className="
relative
overflow-hidden
rounded-3xl
bg-gradient-to-r
from-indigo-600
via-purple-600
to-indigo-700
p-8
text-white
shadow-2xl
">


<div className="
absolute
right-0
top-0
h-72
w-72
rounded-full
bg-white/10
blur-3xl
"/>



<div className="
relative
flex
flex-col
lg:flex-row
justify-between
gap-8
">


<div>


<p className="
uppercase
tracking-[5px]
text-xs
font-mono
text-white/70
">

Admin Control Center

</p>



<h1 className="
mt-3
text-4xl
font-bold
">

User Management

</h1>



<p className="
mt-3
max-w-xl
text-white/80
">

Manage system accounts, roles and access permissions using RBAC controls.

</p>



<div className="
flex
flex-wrap
gap-5
mt-8
">


<div className="
bg-white/20
backdrop-blur
rounded-2xl
px-6
py-4
">

<p className="text-xs text-white/70">
Total Users
</p>

<h2 className="text-3xl font-bold">
{users.length}
</h2>

</div>




<div className="
bg-white/20
backdrop-blur
rounded-2xl
px-6
py-4
">

<p className="text-xs text-white/70">
Active Accounts
</p>

<h2 className="text-3xl font-bold">

{
users.filter(
u=>u.isActive
).length
}

</h2>

</div>




<div className="
bg-white/20
backdrop-blur
rounded-2xl
px-6
py-4
">

<p className="text-xs text-white/70">
Roles Assigned
</p>


<h2 className="text-3xl font-bold">

{
new Set(
users.map(u=>u.role)
).size
}

</h2>

</div>


</div>


</div>




<button

onClick={()=>setIsCreateOpen(true)}

className="
flex
items-center
justify-center
gap-2
bg-white
text-indigo-600
px-6
py-3
rounded-xl
font-semibold
shadow-xl
hover:scale-105
transition
h-fit
"

>

<Plus size={18}/>

Create User

</button>



</div>

</div>




{error && (

<div className="
rounded-2xl
bg-red-50
border
border-red-200
text-red-700
p-4
font-medium
">

{error}

</div>

)}




{/* STATISTICS CARDS */}


<div className="
grid
grid-cols-1
md:grid-cols-4
gap-6
">



<div className="
bg-white
rounded-3xl
border
border-gray-200
shadow-lg
p-6
">

<Users className="text-indigo-600 mb-4"/>

<p className="text-gray-500 text-sm">
All Users
</p>


<h2 className="text-3xl font-bold text-gray-900">

{users.length}

</h2>


</div>





<div className="
bg-white
rounded-3xl
border
border-gray-200
shadow-lg
p-6
">


<UserCheck className="text-green-600 mb-4"/>


<p className="text-gray-500 text-sm">
Active
</p>


<h2 className="text-3xl font-bold">

{
users.filter(
u=>u.isActive
).length
}

</h2>


</div>
<div className="
bg-white
rounded-3xl
border
border-gray-200
shadow-lg
p-6
">

<UserCog className="text-purple-600 mb-4"/>

<p className="text-gray-500 text-sm">
Administrators
</p>

<h2 className="text-3xl font-bold">

{
users.filter(
u=>u.role==="Admin"
).length
}

</h2>

</div>





<div className="
bg-white
rounded-3xl
border
border-gray-200
shadow-lg
p-6
">


<Activity className="text-orange-500 mb-4"/>


<p className="text-gray-500 text-sm">
System Status
</p>


<h2 className="text-3xl font-bold">
Online
</h2>


</div>


</div>





{/* USER TABLE */}


<div className="
bg-white
rounded-3xl
border
border-gray-200
shadow-lg
overflow-hidden
">


<div className="
p-6
border-b
border-gray-200
flex
items-center
justify-between
">


<div>

<h2 className="
text-xl
font-bold
text-gray-900
">

System Users

</h2>


<p className="
text-sm
text-gray-500
">

Manage accounts, roles and access status

</p>


</div>




<div className="
flex
items-center
gap-2
text-sm
text-indigo-600
font-semibold
">

<Shield size={18}/>

RBAC Enabled

</div>


</div>





{
loading ? (

<div className="
p-10
text-center
text-gray-500
">

Loading user accounts...

</div>


) : (



<div className="overflow-x-auto">


<table className="
w-full
text-left
">


<thead>


<tr className="
bg-gray-50
border-b
border-gray-200
text-xs
uppercase
text-gray-500
font-mono
">


<th className="px-6 py-4">
User
</th>


<th className="px-6 py-4">
Email
</th>


<th className="px-6 py-4">
Role
</th>


<th className="px-6 py-4">
Status
</th>


<th className="
px-6
py-4
text-right
">

Actions

</th>


</tr>


</thead>





<tbody className="
divide-y
divide-gray-200
">



{
users.map((u)=>(



<tr

key={u.id}

className="
hover:bg-indigo-50/40
transition
"

>



<td className="px-6 py-4">


<div className="
flex
items-center
gap-4
">


<div className="
h-12
w-12
rounded-full
bg-indigo-600
text-white
flex
items-center
justify-center
font-bold
text-lg
">

{
u.name?.charAt(0).toUpperCase()
}

</div>




<div>


<p className="
font-semibold
text-gray-900
">

{u.name}

</p>


<p className="
text-xs
text-gray-500
">

User ID: {u.id}

</p>


</div>



</div>


</td>






<td className="px-6 py-4">


<span className="
font-mono
text-sm
text-gray-600
">

{u.email}

</span>


</td>








<td className="px-6 py-4">


<span className="
inline-flex
items-center
gap-2
px-3
py-1
rounded-full
bg-indigo-100
text-indigo-700
text-xs
font-bold
">


<Shield size={14}/>


{u.role}


</span>


</td>









<td className="px-6 py-4">



{
u.isActive ? (



<span className="
inline-flex
items-center
gap-2
px-3
py-1
rounded-full
bg-green-100
text-green-700
text-xs
font-semibold
">


<CheckCircle size={14}/>


Active


</span>



) : (



<span className="
inline-flex
items-center
gap-2
px-3
py-1
rounded-full
bg-red-100
text-red-700
text-xs
font-semibold
">


<UserX size={14}/>


Deactivated


</span>


)

}



</td>









<td className="
px-6
py-4
text-right
">



{
u.isActive && (


<button

onClick={()=>handleDeactivate(u.id)}

className="
px-4
py-2
rounded-xl
text-xs
font-semibold
text-red-600
border
border-red-200
hover:bg-red-50
transition
"


>

Deactivate

</button>


)

}




</td>






</tr>



))


}



</tbody>



</table>


</div>



)

}



</div>
{/* ROLE INFORMATION */}


<div className="
grid
md:grid-cols-3
gap-6
">



<div className="
bg-white
rounded-3xl
border
border-gray-200
shadow-lg
p-6
">


<div className="
h-12
w-12
rounded-2xl
bg-indigo-100
flex
items-center
justify-center
mb-4
">

<Shield className="text-indigo-600"/>

</div>


<h3 className="
font-bold
text-lg
text-gray-900
">

Admin

</h3>


<p className="
text-sm
text-gray-500
mt-2
">

Full system access and user management permissions.

</p>


</div>






<div className="
bg-white
rounded-3xl
border
border-gray-200
shadow-lg
p-6
">


<div className="
h-12
w-12
rounded-2xl
bg-purple-100
flex
items-center
justify-center
mb-4
">

<Users className="text-purple-600"/>

</div>


<h3 className="
font-bold
text-lg
text-gray-900
">

Sales

</h3>


<p className="
text-sm
text-gray-500
mt-2
">

CRM access and delivery challan operations.

</p>


</div>






<div className="
bg-white
rounded-3xl
border
border-gray-200
shadow-lg
p-6
">


<div className="
h-12
w-12
rounded-2xl
bg-orange-100
flex
items-center
justify-center
mb-4
">


<UserCog className="text-orange-600"/>


</div>



<h3 className="
font-bold
text-lg
text-gray-900
">

Warehouse

</h3>


<p className="
text-sm
text-gray-500
mt-2
">

Inventory and product management access.

</p>


</div>



</div>








{/* CREATE USER MODAL */}


{
isCreateOpen && (


<div className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/50
backdrop-blur-sm
p-4
">



<div className="
w-full
max-w-lg
bg-white
rounded-3xl
shadow-2xl
p-8
">



<div className="
flex
items-center
justify-between
mb-6
">


<div>

<h2 className="
text-2xl
font-bold
text-gray-900
">

Create System User

</h2>


<p className="
text-sm
text-gray-500
mt-1
">

Add a new account with role permissions.

</p>


</div>




<button

onClick={()=>setIsCreateOpen(false)}

className="
text-gray-400
hover:text-red-500
text-xl
"

>

✕

</button>



</div>






<form

onSubmit={handleCreateSubmit}

className="space-y-5"

>




<div>


<label className="
text-xs
font-semibold
uppercase
text-gray-500
">

Full Name

</label>


<input


type="text"

required


value={form.name}


onChange={(e)=>

setForm({

...form,

name:e.target.value

})

}


placeholder="Enter full name"


className="
mt-2
w-full
rounded-xl
border
border-gray-300
bg-gray-50
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"

 />


</div>






<div>


<label className="
text-xs
font-semibold
uppercase
text-gray-500
">

Email Address

</label>


<input


type="email"

required


value={form.email}


onChange={(e)=>

setForm({

...form,

email:e.target.value

})

}


placeholder="Enter email address"


className="
mt-2
w-full
rounded-xl
border
border-gray-300
bg-gray-50
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"

 />


</div>







<div>


<label className="
text-xs
font-semibold
uppercase
text-gray-500
">

Password

</label>



<input


type="password"

required


value={form.password}


onChange={(e)=>

setForm({

...form,

password:e.target.value

})

}


placeholder="Create password"


className="
mt-2
w-full
rounded-xl
border
border-gray-300
bg-gray-50
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"

 />


</div>








<div>


<label className="
text-xs
font-semibold
uppercase
text-gray-500
">

Role

</label>



<select


value={form.role}


onChange={(e)=>

setForm({

...form,

role:e.target.value

})

}


className="
mt-2
w-full
rounded-xl
border
border-gray-300
bg-gray-50
px-4
py-3
font-semibold
outline-none
focus:ring-2
focus:ring-indigo-500
"

>



<option value="Admin">
Admin - Full Control
</option>


<option value="Sales">
Sales - CRM & Challans
</option>


<option value="Warehouse">
Warehouse - Inventory
</option>


<option value="Accounts">
Accounts - Read Only
</option>


</select>



</div>









<div className="
flex
justify-end
gap-4
pt-5
border-t
border-gray-200
">



<button


type="button"


onClick={()=>setIsCreateOpen(false)}


className="
px-5
py-3
rounded-xl
bg-gray-100
text-gray-600
font-semibold
hover:bg-gray-200
transition
"


>

Cancel

</button>







<button


type="submit"


className="
px-5
py-3
rounded-xl
bg-indigo-600
text-white
font-semibold
hover:bg-indigo-700
transition
shadow-lg
"


>

Create User

</button>



</div>






</form>



</div>



</div>


)

}



</div>


);

};