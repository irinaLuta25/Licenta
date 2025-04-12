import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAllTherapists } from "../../../features/therapists/therapistsSlice";

function Therapists() {
    const dispatch = useDispatch()

    const therapists=useSelector(state => state.therapists.list)
    const status = useSelector(state => state.therapists.status)
    const error =  useSelector(state => state.therapists.error);

    useEffect(()=> {
        dispatch(getAllTherapists())
        console.log("Therapists:", therapists);
    },[dispatch])

    if(status==="loading") return <p>Loading...</p>
    if(status==="failed") return <p>Error: {error}</p>

    return(
        <div>
            <h1>Therapists</h1>
            <ul>
                {
                    therapists.map(t => (
                        <li key={t.id}>
                            <p>{t.user.email}</p>
                            <p>
                            {t.specialist_specializations?.length > 0
                            ? t.specialist_specializations.map(ss => ss.specialization.name).join(', ')
                            : 'Fără specializări'}
                            </p>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
    
}

export default Therapists;