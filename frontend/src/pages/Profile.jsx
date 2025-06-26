import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getUserById, updateUser } from "../features/user/userSlice";
import { getEmployeeByUserId, updateEmployee } from "../features/employee/employeeSlice";
import { getSpecialistByUserId, updateSpecialist } from "../features/therapists/therapistsSlice";
import CustomDropdownBlock from "../components/CustomDropdownBlock";


const DEPARTMENT_OPTIONS = [
    { label: "Resurse Umane", value: "Resurse Umane" },
    { label: "Financiar", value: "Financiar" },
    { label: "Marketing", value: "Marketing" },
    { label: "IT", value: "IT" },
];

const FORMATION_OPTIONS = [
    { label: "CBT", value: "CBT" },
    { label: "Psihanaliză", value: "Psihanaliza" },
    { label: "Sistemică", value: "Sistemica" },
    { label: "Experiențială", value: "Experientiala" },
];

const SPECIALIZATION_OPTIONS = [
    { label: "Burnout", value: "Burnout" },
    { label: "Adicții", value: "Adictii" },
    { label: "Tulburări de anxietate și depresie", value: "Tulburări de anxietate și depresie" },
    { label: "Traumă și abuz", value: "Traumă și abuz" },
];

const THERAPY_STYLE_OPTIONS = [
    { label: "Empatic", value: "Empatic" },
    { label: "Directiv", value: "Directiv" },
    { label: "Explorator", value: "Explorator" },
    { label: "Non-directiv", value: "Non-directiv" },
    { label: "Orientat pe obiective", value: "Orientat pe obiective" },
];

const ALLOW_ANONYMOUS_OPTIONS = [
    { label: "DA", value: true },
    { label: "NU", value: false },
]


function Profile() {
    const dispatch = useDispatch();

    const userFromCookie = useSelector((state) => state.auth.user);
    const user = useSelector((state) => state.user.user);
    const employee = useSelector((state) => state.employee.employee);
    const specialist = useSelector((state) => state.therapists.loggedInTherapist);

    const [editingField, setEditingField] = useState(null);
    const [fieldValue, setFieldValue] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(user?.profileImage);

    const handleEditClick = (field, value) => {
        if (field === "allowAnonymous") {
            setFieldValue(value === "DA");
        } else {
            setFieldValue(value);
        }
        setEditingField(field);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


    const handleConfirmImageUpload = async () => {
        if (!imageFile || !user) return;

        try {
            const updatedUser = {
                ...user,
                profileImage: imageFile,
            };

            await dispatch(updateUser({
                id: user.id,
                user: updatedUser
            })).unwrap();

            dispatch(getUserById(user.id));
            setImageFile(null);
        } catch (err) {
            console.error("Eroare la salvare imagine:", err);
        }
    };

    const handleCancelImageUpload = () => {
        setImageFile(null);
        setImagePreview(user?.profileImage);
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            console.log("Field:", editingField);
            console.log("Value to save:", fieldValue);

            if (editingField === "phoneNumber") {
                await dispatch(updateUser({
                    id: user?.id,
                    user: { ...user, phoneNumber: fieldValue, }
                })).unwrap();
                dispatch(getUserById(user.id));
            }

            else if (user?.role === "angajat") {
                const updatedEmployee = {
                    ...employee,
                    [editingField]: fieldValue
                };
                await dispatch(updateEmployee({
                    id: employee?.id,
                    employee: updatedEmployee
                })).unwrap();
                dispatch(getEmployeeByUserId(user.id));
            }

            else if (user?.role === "specialist") {
                const updatedSpecialist = {
                    ...specialist,
                    [editingField]: fieldValue
                };
                await dispatch(updateSpecialist({
                    id: specialist?.id,
                    specialist: updatedSpecialist
                })).unwrap();
                dispatch(getSpecialistByUserId(user?.id));
            }

            setEditingField(null);
        } catch (error) {
            console.error("Eroare la salvare:", error);
        }
    };


    useEffect(() => {
        if (userFromCookie?.id) {
            dispatch(getUserById(userFromCookie?.id));
        }
    }, [userFromCookie, dispatch]);

    useEffect(() => {
        if (user?.role === "angajat") {
            dispatch(getEmployeeByUserId(user?.id));
        } else {
            dispatch(getSpecialistByUserId(user?.id));
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (user?.profileImage) {
            setImagePreview(user.profileImage);
            setImageFile(null);
        }
    }, [user]);


    const renderField = (label, field, value) => {
        const isDropdownField = ["department", "formation", "specialization", "therapyStyle", "allowAnonymous"].includes(field);

        const dropdownOptions = {
            department: DEPARTMENT_OPTIONS,
            formation: FORMATION_OPTIONS,
            specialization: SPECIALIZATION_OPTIONS,
            therapyStyle: THERAPY_STYLE_OPTIONS,
            allowAnonymous: ALLOW_ANONYMOUS_OPTIONS,
        };

        return (
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-indigo-900">{label}</h2>
                <div className="min-h-[44px] flex justify-between items-start gap-4 w-full">
                    {editingField === field ? (
                        <>
                            {isDropdownField ? (
                                <div className="w-full">
                                    <CustomDropdownBlock
                                        value={fieldValue}
                                        onChange={(val) => setFieldValue(val)}
                                        options={dropdownOptions[field]}
                                    />
                                </div>
                            ) : field === "description" ? (
                                <textarea
                                    value={fieldValue}
                                    onChange={(e) => setFieldValue(e.target.value)}
                                    className="p-2 border rounded-md shadow-sm w-full resize-none"
                                    style={{ minHeight: "130px" }}
                                />
                            ) : (
                                <input
                                    value={fieldValue}
                                    onChange={(e) => setFieldValue(e.target.value)}
                                    className="p-1 border rounded-md shadow-sm w-full"
                                />
                            )}
                            <div className="flex gap-2 pt-1">
                                <button onClick={handleSave} className="text-green-600"><FaCheck /></button>
                                <button onClick={() => setEditingField(null)} className="text-red-600"><FaTimes /></button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="whitespace-pre-wrap break-words w-full max-w-3xl">
                                {isDropdownField ? getLabelFromValue(dropdownOptions[field], value) : value || "-"}
                            </p>
                            <button className="text-indigo-600 hover:text-indigo-800 mt-1" onClick={() => handleEditClick(field, value)}>
                                <FaEdit />
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    const getLabelFromValue = (options, value) => {
        const found = options.find(opt => opt.value === value);
        return found ? found.label : value;
    };


    return (
        <div className="pt-24 px-8 py-6 pb-28 bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen text-gray-800">
            <Navbar />

            <div className="max-w-5xl mx-auto bg-white/80 rounded-3xl shadow-xl p-8 mt-10 space-y-10">
                <div className="flex flex-col md:flex-row items-top gap-6">
                    <div className="flex flex-col items-center gap-3">
                        <img
                            src={imagePreview || user?.profileImage}
                            alt="Poza de profil"
                            className="w-64 h-64 object-cover rounded-xl shadow-md"
                        />

                        {imageFile ? (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleConfirmImageUpload}
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-1.5 rounded-md transition"
                                >
                                    Salvează
                                </button>
                                <button
                                    onClick={handleCancelImageUpload}
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1.5 rounded-md transition"
                                >
                                    Anulează
                                </button>
                            </div>
                        ) : (
                            <>
                                <input
                                    type="file"
                                    id="upload-photo"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                <label
                                    htmlFor="upload-photo"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-1.5 rounded-md transition cursor-pointer inline-block text-center"
                                >
                                    Schimbă poza
                                </label>
                            </>

                        )}
                    </div>


                    <div className="space-y-3 w-full">
                        <h2 className="text-xl font-semibold text-indigo-900">Nume complet</h2>
                        <p>{user?.firstName} {user?.lastName}</p>
                        {renderField("Telefon", "phoneNumber", user?.phoneNumber)}
                        <h2 className="text-xl font-semibold text-indigo-900">Email</h2>
                        <p>{user?.email}</p>
                        <h2 className="text-xl font-semibold text-indigo-900">Data nașterii</h2>
                        <p>{user?.birthdate && new Date(user.birthdate).toLocaleDateString("ro-RO")}</p>
                    </div>
                </div>

                {user?.role === "angajat" && (
                    <div className="bg-indigo-100 rounded-2xl p-6 shadow-inner">
                        <h2 className="text-xl font-semibold text-indigo-900">Data angajării</h2>
                        <p className="pb-4">{employee?.hireDate && new Date(employee.hireDate).toLocaleDateString("ro-RO")}</p>
                        {renderField("Departament", "department", employee?.department)}
                        {renderField("Acord prelucrare anonima date", "allowAnonymous", employee?.allowAnonymous ? "DA" : "NU")}
                    </div>
                )}

                {user?.role === "specialist" && specialist && (
                    <div className="bg-indigo-50 rounded-2xl p-6 shadow-inner space-y-4">
                        {renderField("Descriere profesională", "description", specialist.description)}
                        {renderField("LinkedIn", "linkedin", specialist.linkedin)}
                        {renderField("Facebook", "facebook", specialist.facebook)}
                        {renderField("Website personal", "website", specialist.website)}

                        {specialist.isTherapist && (
                            <>
                                {renderField("Formare", "formation", specialist.formation)}
                                {renderField("Specializare", "specialization", specialist.specialization)}
                                {renderField("Stil terapeutic", "therapyStyle", specialist.therapyStyle)}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
