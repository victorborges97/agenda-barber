import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
  where,
} from "firebase/firestore";

import { db } from "../services/firebase";

import {
  PropsItemHorarioAgendados,
  PropsItemHorarioAtendimento,
} from "../types";

import { Table } from "../components/tableAgendamentos";
import ModalHorarioAtendimentos from "../components/modalHorarioAtendimentos";
import withPrivateRoute from "../private/withPrivateRoute";

const Home: NextPage = () => {
  const newDate = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(newDate);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [horariosAtendidos, setHorariosAtendidos] = useState<
    PropsItemHorarioAtendimento[]
  >([]);

  const [horariosAgendadosBackup, setHorariosAgendadosBackup] = useState<
    PropsItemHorarioAgendados[]
  >([]);

  const [horariosAgendadosExibir, setHorariosAgendadosExibir] = useState<
    PropsItemHorarioAgendados[]
  >([]);

  useEffect(() => {
    console.log("Horario Atendidos");
    // setLoading(true);

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
        setHorariosAtendidos(dataType);
        // setLoading(false);
      },
      (error) => {
        console.log(error.message);
        // setLoading(false);
      }
    );

    return () => {
      console.log("REMOVE SUBSCRIBE");
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    horariosAtendidosFun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [horariosAtendidos]);

  useEffect(() => {
    horariosAtendidosFun();

    return () => {
      console.log("REMOVE SUBSCRIBE");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  async function horariosAtendidosFun() {
    setLoading(true);
    setHorariosAgendadosExibir([]);
    const listaHorarioAtendimentos = horariosAtendidos.map((item, index) => {
      const new1: PropsItemHorarioAgendados = {
        data: "",
        cliente: "",
        hora: item.hora,
        id: "",
        isAlmoco: item.isAlmoco,
        isCafe: item.isCafe,
        pago: false,
        active: false,
      };
      return new1;
    });
    await getAgendados(listaHorarioAtendimentos);
    setLoading(false);
  }

  async function getAgendados(
    listaHorarioAtendimentos: PropsItemHorarioAgendados[]
  ) {
    if (selectedDate !== "") {
      const q = query(
        collection(db, "agendamentos"),
        orderBy("hora"),
        where("data", "==", selectedDate)
      );

      onSnapshot(
        q,
        (querySnapshot) => {
          console.log("querySnapshot");
          let listaAgendados: PropsItemHorarioAgendados[] = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const addData: PropsItemHorarioAgendados = {
              id: doc.id,
              data: data.data,
              hora: data.hora,
              isAlmoco: data.isAlmoco,
              isCafe: data.isCafe,
              cliente: data.cliente,
              pago: data.pago,
              active: data.active,
            };
            listaAgendados.push(addData);
          });

          let oldData = listaHorarioAtendimentos;
          listaAgendados.forEach((item) => {
            let index = oldData.findIndex(
              (iIndex) => iIndex.hora === item.hora
            );
            if (index > -1) {
              oldData[index] = item;
            }
          });

          setHorariosAgendadosExibir(oldData);
        },

        (error) => {
          console.log(error.message);
          setLoading(false);
        }
      );

      // return () => {
      //   unsubscribe();
      // };

      // const querySnapshot = await getDocs(q);
      // let listaAgendados: PropsItemHorarioAgendados[] = [];
      // querySnapshot.forEach((querySnapshot) => {
      //   const data = querySnapshot.data();
      //   const addData: PropsItemHorarioAgendados = {
      //     id: querySnapshot.id,
      //     data: data.data,
      //     hora: data.hora,
      //     isAlmoco: data.isAlmoco,
      //     isCafe: data.isCafe,
      //     cliente: data.cliente,
      //     pago: data.pago,
      //     active: data.active,
      //   };
      //   listaAgendados.push(addData);
      // });

      // let oldData = listaHorarioAtendimentos;
      // listaAgendados.forEach((item) => {
      //   let index = oldData.findIndex((iIndex) => iIndex.hora === item.hora);
      //   if (index > -1) {
      //     oldData[index] = item;
      //   }
      // });

      // setHorariosAgendadosExibir(oldData);
    }
  }

  return (
    <div>
      <Head>
        <title>Agenda Barber</title>
        <meta name="description" content="Generated by create next app" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/@themesberg/flowbite@latest/dist/flowbite.min.css"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className="
      min-h-screen h-full 
      min-w-screen w-full 
      pb-8 bg-zinc-800"
      >
        {/* */}
        <div className="pt-8 flex flex-row justify-center items-center">
          <p className="text-white font-extrabold text-3xl">Agenda Barber</p>
        </div>
        {/* INPUT */}
        <div className="p-8 flex flex-row justify-center items-center text-gray-500 dark:text-gray-400">
          <div className="relative max-w-sm pr-2 h-[45px]">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-50 border border-gray-300 h-[45px] text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Select date"
            />
          </div>
          <button
            className="block max-h-full transition-all duration-300 h-[45px] bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none outline-none rounded-lg text-sm p-2.5 text-center"
            type="button"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
        {/* TABLE */}
        <div className="flex flex-row justify-center items-center text-gray-500 dark:text-gray-400">
          <Table
            dataString={selectedDate}
            data={horariosAgendadosExibir}
            header={headerTable}
            onRefresh={() => {
              horariosAtendidosFun();
            }}
            loading={loading}
          />
        </div>
        {/* MODAL CONFIG HORARIO QUE VAI ATENDER */}
        {openModal && (
          <ModalHorarioAtendimentos
            onClose={() => {
              setOpenModal(false);
            }}
            show={openModal}
            title="Configurar Horarios de Atendimento"
          />
        )}
      </main>
    </div>
  );
};

const headerTable = [
  {
    name: "Hora",
    className: "",
    isButton: false,
  },
  {
    name: "Cliente",
    className: "",
    isButton: false,
  },
  {
    name: "Foi pago",
    className: "",
    isButton: false,
  },
  {
    name: "",
    className: "",
    isButton: true,
  },
];

export default withPrivateRoute(Home);
