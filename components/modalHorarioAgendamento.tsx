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
} from "firebase/firestore";
import { horariosPadroesFixo } from "../constants";
import {
  PropsItemHorarioAgendados,
  PropsItemHorarioAtendimento,
} from "../types";
import Loading from "./loading";

type ModalProps = {
  show: boolean;
  onClose: (b: boolean) => void;
  title: string;
  dataString: string;
  item: PropsItemHorarioAgendados;
};

const ModalHorarioAgendamento: React.FC<ModalProps> = ({
  show,
  onClose,
  title,
  dataString,
  item,
}) => {
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCloseClick = (e: any) => {
    e.preventDefault();
    onClose(false);
  };

  const handleSaveClick = async (e: any) => {
    e.preventDefault();
    try {
      await handleAddAgendamento();
      onClose(true);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleAddAgendamento = async () => {
    if (nome !== "") {
      const docRef = await addDoc(
        collection(db, "agendamentos/userID/atendimentos"),
        {}
      );

      const new1: PropsItemHorarioAgendados = {
        data: dataString,
        cliente: nome,
        hora: item.hora,
        id: docRef.id,
        isAlmoco: false,
        isCafe: false,
        pago: false,
        active: true,
      };

      await setDoc(doc(db, "agendamentos", new1.id), new1);
      setNome("");
    } else {
      setError("Nome do cliente está em branco");
      setTimeout(() => setError(null), 2000);
      throw new Error("Nome do cliente está em branco");
    }
  };

  const handleUpdateAgendamento = async (id: string, obj: object) => {
    // await setDoc(doc(db, "agendamentos", id), obj, {
    //   merge: true,
    // });
  };

  const handleRemoveAgendamento = async (id: string) => {
    // await deleteDoc(doc(db, "agendamentos", id));
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
                <p className="m-2 mx-auto text-center text-sm">
                  Adicione um novo agendamento
                </p>
                <div className="flex text-xl items-center justify-center">
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="bg-gray-50 border border-gray-300 h-[45px] text-gray-900 sm:text-sm rounded-lg focus:outline-none outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-0 focus:border-gray-300"
                    placeholder="Nome do cliente"
                  />
                </div>
              </div>
            </div>

            {error !== null && (
              <p
                className="m-2 mx-auto text-center 
              text-red-600 font-bold
                text-xs
              "
              >
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-4">
              <button
                onClick={handleCloseClick}
                className="overflow-hidden relative false flex items-center justify-center gap-1 font-bold outline-none uppercase tracking-wider focus:outline-none focus:shadow-none transition-all duration-300 rounded-lg py-2.5 px-6 text-xs leading-normal bg-transparent text-red-500 hover:bg-red-50 hover:text-red-700 active:bg-red-100 undefined"
              >
                Fechar
              </button>
              <button
                onClick={handleSaveClick}
                className="overflow-hidden relative false flex items-center justify-center gap-1 font-bold outline-none uppercase tracking-wider focus:outline-none focus:shadow-none transition-all duration-300 rounded-lg py-2.5 px-6 text-xs leading-normal text-white bg-green-500 hover:bg-green-700 focus:bg-green-400 active:bg-green-800 shadow-md-green hover:shadow-lg-green undefined"
              >
                Salvar
              </button>
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

export default ModalHorarioAgendamento;
