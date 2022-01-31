import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { PropsItemHorarioAgendados } from "../types";
import Loading from "./loading";
import ModalHorarioAgendamento from "./modalHorarioAgendamento";

type TableProps = {
  data: PropsItemHorarioAgendados[];
  header: any[];
  dataString: string;
  onRefresh: () => void;
  loading: boolean;
};

export const Table: React.FC<TableProps> = ({
  data: dataTable,
  header,
  dataString,
  onRefresh,
  loading = false,
}) => {
  const [itemSelecionado, setItemSelecionado] =
    useState<PropsItemHorarioAgendados>();
  const [modalShow, setModalShow] = useState(false);

  const handleModal = (item: PropsItemHorarioAgendados) => {
    setItemSelecionado(item);
    setModalShow(true);
  };

  const handleUpdateAgendamento = async (id: string, obj: object) => {
    await updateDoc(doc(db, "agendamentos", id), obj);
  };

  const Linha = ({
    item,
    key,
  }: {
    item: PropsItemHorarioAgendados;
    key: string;
  }) => {
    const bg = item.isAlmoco ? "bg-red-500" : "bg-white dark:bg-gray-800";
    const title = item.isAlmoco
      ? "text-white"
      : "text-gray-900 dark:text-white";

    const isAlmoco = item.isAlmoco ? "font-medium" : "";

    const text = item.isAlmoco
      ? "text-white"
      : "text-gray-600 dark:text-gray-400";

    const textButton = item.isAlmoco
      ? "text-white hover:text-gray-900"
      : "text-blue-600 hover:text-blue-900 dark:text-blue-500";

    return (
      <tr key={key} className={`${bg} border-b dark:border-gray-700 ${text}`}>
        <td
          className={`py-4 px-6 text-sm font-medium ${title} whitespace-nowrap `}
        >
          {item.hora}
        </td>
        <td className={`py-4 px-6 text-sm whitespace-nowrap ${isAlmoco}`}>
          {item.isAlmoco ? "ALMOÇO" : item.active ? item.cliente : "-"}
        </td>
        <td className={`py-4 px-6 text-sm whitespace-nowrap ${isAlmoco}`}>
          {item.isAlmoco ? (
            ""
          ) : item.active ? (
            <input
              className="form-check-input appearance-none h-4 w-4 border 
              border-gray-300 rounded-sm bg-white 
              checked:bg-green-600 checked:border-green-600 
              checked:outline-none
              focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat 
              bg-center bg-contain float-left mr-2 cursor-pointer"
              type="checkbox"
              checked={item.pago}
              onChange={(e) => {
                if (item.id !== "") {
                  handleUpdateAgendamento(item.id, { pago: !item.pago });
                }
              }}
              id={"flexCheck" + item.hora}
            />
          ) : (
            "-"
          )}
        </td>
        <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
          {item.isAlmoco ? (
            ""
          ) : (
            <p
              className={`dark:hover:underline cursor-pointer ${textButton}`}
              onClick={() => {
                if (item.active === false) {
                  handleModal(item);
                } else {
                }
              }}
            >
              {item.active === false ? "Adicionar" : "Editar"}
            </p>
          )}
        </td>
      </tr>
    );
  };

  const LinhaLoading = () => {
    const bg = "bg-white dark:bg-gray-800";
    const title = "";
    const text = "";
    return (
      <tr className={`${bg} border-b dark:border-gray-700 ${text}`}>
        <td className={`py-4 px-6 text-sm font-medium ${title}`}>
          <Loading />
        </td>
        <td className={`py-4 px-6 text-sm font-medium ${title}`}>
          <Loading />
        </td>
        <td className={`py-4 px-6 text-sm font-medium ${title}`}>
          <Loading />
        </td>
        <td className={`py-4 px-6 text-sm font-medium ${title}`}>
          <Loading />
        </td>
      </tr>
    );
  };

  const LinhaEmpty = () => {
    const bg = "bg-white dark:bg-gray-800";
    const title = "";
    const text = "";
    return (
      <tr className={`${bg} border-b dark:border-gray-700 ${text}`}>
        <td
          colSpan={4}
          className={`py-4 px-6 text-sm text-center font-medium ${title}`}
        >
          SEM DADOS
        </td>
      </tr>
    );
  };

  const Header = ({
    name,
    className,
    isButton,
  }: {
    name: string;
    className: string;
    isButton: boolean;
  }) => {
    if (isButton) {
      return (
        <th
          scope="col"
          onClick={onRefresh}
          className="flex justify-center py-3 px-6 text-xs font-medium tracking-wider text-center text-gray-700 uppercase dark:text-gray-400 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </th>
      );
    }
    return (
      <th
        scope="col"
        className={
          "py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400 " +
          className
        }
      >
        {name}
      </th>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-md sm:rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {header &&
                    header.map((item, index) => (
                      <Header
                        name={item.name}
                        className={item.className}
                        key={index}
                        isButton={item.isButton}
                      />
                    ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <React.Fragment key={"LOADDINH"}>
                    <LinhaLoading />
                  </React.Fragment>
                )}
                {!loading && dataTable && dataTable.length <= 0 ? (
                  <React.Fragment key="EMPTY">
                    <LinhaEmpty />
                  </React.Fragment>
                ) : (
                  dataTable.map((item, index) =>
                    Linha({
                      item: item,
                      key: `${index}__${item.id}__${item.data}`,
                    })
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalHorarioAgendamento
        dataString={dataString}
        item={itemSelecionado!}
        show={modalShow}
        onClose={(foi) => {
          setModalShow(false);
          if (foi) {
            onRefresh();
          }
        }}
        title="Adicionar agendamento"
      />
    </div>
  );
};
