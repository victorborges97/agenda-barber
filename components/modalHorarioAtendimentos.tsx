import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  addDoc,
  deleteDoc,
  collection,
  DocumentData,
  QueryDocumentSnapshot,
  setDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { horariosPadroesFixo } from "../constants";
import { PropsItemHorarioAtendimento } from "../types";
import Loading from "./loading";

type ModalProps = {
  show: boolean;
  onClose: () => void;
  title: string;
};

const ModalHorarioAtendimentos: React.FC<ModalProps> = ({
  show,
  onClose,
  title,
}) => {
  const [loading, setLoading] = useState(false);
  const [minutes, setMinutes] = useState("00");
  const [hours, setHours] = useState("05");
  const [horariosSelect, setHorariosSelect] = useState<string[]>([]);
  const [horariosAtendidosModal, setHorariosAtendidosModal] = useState<
    PropsItemHorarioAtendimento[]
  >([]);

  useEffect(() => {
    const horariosText = horariosAtendidosModal.map(
      (e) => e.hora.split(":")[0]
    );
    const horariosPadroesFixoRetiradosJaCadastrados =
      horariosPadroesFixo.filter((hF) => !horariosText.some((e) => e === hF));
    setHorariosSelect(horariosPadroesFixoRetiradosJaCadastrados);
  }, [horariosAtendidosModal]);

  useEffect(() => {
    console.log("ModalHorarioAtendimentos");
    setLoading(true);

    const q = query(collection(db, "atendimentos"), orderBy("hora"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let dataType: PropsItemHorarioAtendimento[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const addData: PropsItemHorarioAtendimento = {
            id: doc.id,
            hora: data.hora,
            isAlmoco: data.isAlmoco,
            isCafe: data.isCafe,
          };
          dataType.push(addData);
        });
        setHorariosAtendidosModal(dataType);
        setLoading(false);
      },
      (error) => {
        console.log(error.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleCloseClick = (e: any) => {
    e.preventDefault();
    onClose();
  };

  const handleSaveClick = (e: any) => {
    e.preventDefault();
    onClose();
  };

  const handleAddHorarioAtendimento = async (event: any) => {
    event.preventDefault();
    if (hours !== "" && minutes !== "") {
      const docRef = await addDoc(collection(db, "atendimentos"), {});

      const newAtendimento = {
        id: docRef.id, //uuidv4(),
        hora: `${hours}:${minutes}`,
        isAlmoco: false,
        isCafe: false,
      };

      await setDoc(doc(db, "atendimentos", newAtendimento.id), newAtendimento);
    }
  };

  const handleUpdateHorarioAtendimento = async (id: string, obj: object) => {
    await updateDoc(doc(db, "atendimentos", id), obj);
  };

  const handleRemoveHorarioAtendimento = async (id: string) => {
    await deleteDoc(doc(db, "atendimentos", id));
  };

  const mainModal = show
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";
  const containerModal = show
    ? "opacity-100 translate-y-0"
    : "opacity-0 -translate-y-10";
  const backdropModal = show
    ? "opacity-25 pointer-events-auto"
    : "opacity-0 pointer-events-none";

  return (
    <>
      <div
        className={`${mainModal} grid place-items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none transition-all duration-500`}
      >
        <div
          className={`transform ${containerModal} w-auto my-6 mx-auto max-w-sm transition-all duration-500`}
        >
          <div className="border-0 p-6 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-center justify-between mb-6">
              <h5 className="text-gray-900 text-base font-bold mt-0 mb-0">
                {title}
              </h5>

              <button
                onClick={handleCloseClick}
                className="ml-4 relative flex items-center justify-center text-gray-900 text-3xl leading-none outline-none focus:outline-none"
              >
                <span className="text-gray-900 text-3xl mb-1">×</span>
              </button>
            </div>

            <div className="relative flex-auto mb-6">
              <div>
                <p className="m-2 mx-auto text-center">
                  Adicione um novo Horario
                </p>
                <div className="flex text-xl items-center justify-center">
                  <select
                    name="hours"
                    className="bg-gray-50 border border-gray-300 h-[45px] rounded-lg appearance-none outline-none"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  >
                    {horariosSelect &&
                      horariosSelect.map((h) => (
                        <option value={h} key={h}>
                          {h}
                        </option>
                      ))}
                  </select>
                  <span className="text-xl m-1 h-[45px] ">:</span>
                  <select
                    name="minutes"
                    className="bg-gray-50 border border-gray-300 h-[45px] rounded-lg appearance-none outline-none mr-2"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                  >
                    <option value="00">00</option>
                    <option value="30">30</option>
                  </select>
                  <button
                    className="block max-h-full transition-all duration-300 h-[45px] bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none outline-none rounded-lg text-sm p-2.5 text-center"
                    type="button"
                    onClick={handleAddHorarioAtendimento}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <p className="m-2 mx-auto text-center">Horarios Atendidos</p>
                <div className="max-h-52 overflow-auto">
                  <ItemHorariosAtendidosHeader
                    item={{
                      horario: "Hora",
                      isAlmoco: "Almoço",
                      cafe: "Café",
                      remove: "Remover",
                    }}
                  />
                  {loading ? (
                    <div className="flex justify-center">
                      <Loading />
                    </div>
                  ) : !loading && horariosAtendidosModal.length === 0 ? (
                    <ItemHorariosAtendidosEmpty />
                  ) : (
                    horariosAtendidosModal &&
                    horariosAtendidosModal.map((item, index) => (
                      <ItemHorariosAtendidos
                        item={item}
                        key={item.id}
                        onClick={() => {
                          handleRemoveHorarioAtendimento(item.id);
                        }}
                        onClickAlmoco={(check) => {
                          handleUpdateHorarioAtendimento(item.id, {
                            isAlmoco: check,
                          });
                        }}
                        onClickCafe={(check) => {
                          handleUpdateHorarioAtendimento(item.id, {
                            isCafe: check,
                          });
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                onClick={handleCloseClick}
                className="overflow-hidden relative false flex items-center justify-center gap-1 font-bold outline-none uppercase tracking-wider focus:outline-none focus:shadow-none transition-all duration-300 rounded-lg py-2.5 px-6 text-xs leading-normal bg-transparent text-red-500 hover:bg-red-50 hover:text-red-700 active:bg-red-100 undefined"
              >
                Fechar
              </button>
              {/**
               * <button
                onClick={handleSaveClick}
                className="overflow-hidden relative false flex items-center justify-center gap-1 font-bold outline-none uppercase tracking-wider focus:outline-none focus:shadow-none transition-all duration-300 rounded-lg py-2.5 px-6 text-xs leading-normal text-white bg-green-500 hover:bg-green-700 focus:bg-green-400 active:bg-green-800 shadow-md-green hover:shadow-lg-green undefined"
              >
                Salvar
              </button>
               */}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${backdropModal} fixed inset-0 z-40 bg-black transition-all duration-500`}
      ></div>
    </>
  );
};

const Converte = (e: QueryDocumentSnapshot<DocumentData>) => {
  const data = e.data();
  let newDoc: PropsItemHorarioAtendimento = {
    id: e.id,
    hora: data.hora,
    isAlmoco: data.isAlmoco,
    isCafe: data.isCafe,
  };
  return newDoc;
};

const ItemHorariosAtendidos = ({
  item,
  onClick,
  onClickAlmoco,
  onClickCafe,
}: {
  item: PropsItemHorarioAtendimento;
  onClick: () => void;
  onClickAlmoco: (e: boolean) => void;
  onClickCafe: (e: boolean) => void;
}) => (
  <div className="flex flex-wrap m-2 justify-center overflow-hidden bg-gray-50 border border-gray-300 h-[45px] rounded-lg py-2">
    <div className="px-1 w-1/4 overflow-hidden">
      <div className=" appearance-none outline-none">{item.hora}</div>
    </div>

    <div className="px-1 w-1/4 overflow-hidden flex justify-center">
      <input
        className="form-check-input appearance-none h-4 w-4 
        border border-gray-300 rounded-sm bg-white 
        checked:bg-green-600 checked:border-green-600 
        checked:outline-none
        focus:outline-none outline-none transition duration-200 mt-1 align-top bg-no-repeat 
        bg-center bg-contain float-left mr-2 cursor-pointer"
        type="checkbox"
        checked={item.isAlmoco}
        onChange={(e) => onClickAlmoco(e.target.checked)}
        id="flexCheckDefault"
      />
    </div>

    <div className="px-1 w-1/4 overflow-hidden flex justify-center">
      <input
        className="form-check-input appearance-none h-4 w-4 border 
        border-gray-300 rounded-sm bg-white 
        checked:bg-green-600 checked:border-green-600 
        checked:outline-none
        focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat 
        bg-center bg-contain float-left mr-2 cursor-pointer"
        type="checkbox"
        checked={item.isCafe}
        onChange={(e) => onClickCafe(e.target.checked)}
        id="flexCheckDefault"
      />
    </div>

    <div className="px-1 w-1/4 overflow-hidden flex justify-center">
      <button
        className="block max-h-full transition-all duration-300 bg-red-500 border border-red-300 focus:outline-none outline-none rounded-lg text-sm p-1 text-center"
        type="button"
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
);

const ItemHorariosAtendidosHeader = ({ item }: { item: any }) => (
  <div className="flex flex-wrap m-2 justify-center overflow-hidden">
    <div className="my-2 px-1 w-1/4 overflow-hidden">
      <div className="appearance-none outline-none">{item.horario}</div>
    </div>

    <div className="my-2 px-1 w-1/4 overflow-hidden flex justify-center divide-y divide-gray-500">
      <div className="appearance-none outline-none">{item.isAlmoco}</div>
    </div>

    <div className="my-2 px-1 w-1/4 overflow-hidden flex justify-center divide-y divide-gray-500">
      <div className="appearance-none outline-none">{item.cafe}</div>
    </div>

    <div className="my-2 px-1 w-1/4 overflow-hidden flex justify-center divide-y divide-gray-500">
      <div className="appearance-none outline-none">{item.remove}</div>
    </div>
  </div>
);

const ItemHorariosAtendidosEmpty = () => (
  <div className="flex flex-wrap m-2 justify-center overflow-hidden">
    <div className="my-2 px-1 w-full overflow-hidden">
      <div className="appearance-none outline-none text-center">SEM DADOS</div>
    </div>
  </div>
);

export default ModalHorarioAtendimentos;
