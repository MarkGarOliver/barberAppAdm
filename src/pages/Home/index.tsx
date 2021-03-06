import React from "react";

import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  useIonToast,
} from "@ionic/react";
import {
  bag,
  calendar,
  chatbubbles,
  checkmarkCircle,
  cut,
  time,
} from "ionicons/icons";

import servicesIcon from "../../assets/barberServicesCut.png";
import barberBg from "../../assets/barber-bg.png";

import { Link } from "react-router-dom";
import { useAuth } from "../../contexts";
import supabase from "../../utils/supabase";

const Home = () => {
  const [showToast] = useIonToast();
  const [schedulesToShow, setSchedulesToShow] = React.useState<Array<any>>([]);
  const [currentName, setcurrentName] = React.useState(null);

  const { sessionUser } = useAuth();

  const getSchedulesToShow = async () => {
    let date = new Date();
    let currentDate = new Intl.DateTimeFormat("en-US").format(date);

    try {
      let { data, error } = await supabase
        .from("schedules")
        .select("*")

        .eq("date", currentDate);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (data) {
        setSchedulesToShow(data);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    }
  };

  React.useEffect(() => {
    getSchedulesToShow();
  }, []);

  React.useEffect(() => {
    const nameStr = sessionUser?.user_metadata?.full_name;
    const nameArray = nameStr.split(" ");
    setcurrentName(nameArray[0]);
  }, []);

  return (
    <IonPage>
      {sessionUser && (
        <IonContent fullscreen>
          <div className="h-screen py-10 px-5 bg-gray-100">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <IonText className="text-sm text-gray-500 mb-1 font-light">
                  Bem vindo{"(a)"}
                </IonText>
                <IonText className="text-black-200 text-2xl font-bold uppercase">
                  {currentName}
                </IonText>
              </div>
              <div className="flex items-center">
                <Link to="/app/profile">
                  <IonAvatar className="flex items-center w-[70px] h-[70px]">
                    <img
                      src="https://blog.unyleya.edu.br/wp-content/uploads/2017/12/saiba-como-a-educacao-ajuda-voce-a-ser-uma-pessoa-melhor.jpeg"
                      alt="profile"
                    />
                  </IonAvatar>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-[30%_1fr] gap-4 py-3">
              <Link
                to="/app/calendar"
                className="flex flex-col justify-center items-center h-32 shadow rounded-3xl bg-gradient-to-l from-green-800 to-green-600"
              >
                <IonIcon className="mb-5 w-8 h-8 text-white" src={calendar} />

                <IonText className="text-white">Calend??rio</IonText>
              </Link>
              <div className="flex flex-col justify-center items-center h-32 shadow rounded-3xl bg-gradient-to-r from-white to-white-200">
                <IonIcon
                  className="mb-5 w-8 h-8 text-gray-500"
                  src={chatbubbles}
                />

                <IonText className="text-gray-400 ">Chats</IonText>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3">
              <Link
                to="/app/services/"
                className="flex flex-col justify-center items-center h-32 col-span-2 shadow rounded-3xl bg-gradient-to-l from-green-800 to-green-600"
              >
                {/* <IonIcon className="mb-5 w-8 h-8 text-white" src={cut} /> */}
                <img className="w-10 h-10" src={servicesIcon} alt="" />
                <IonText className="text-white my-1">Servi??os</IonText>
              </Link>

              <Link
                to="/app/products"
                className="flex flex-col justify-center items-center h-32 shadow rounded-3xl bg-gradient-to-r from-white to-white-200"
              >
                <IonIcon className="mb-5 w-8 h-8 text-gray-500" src={bag} />

                <IonText className="text-gray-400">Produtos</IonText>
              </Link>
            </div>

            <div className="w-full h-auto shadow rounded-3xl py-5 bg-red">
              <div className="flex justify-start mx-5">
                <IonIcon className="mb-5 w-6 h-6 text-gray-500" src={time} />
                <IonText className="ml-2 text-gray-500">
                  Agendamentos hoje
                </IonText>
              </div>
              <div className="flex justify-center">
                <div className="h-[1px] w-4/5 bg-gray-500" />
              </div>
              <IonList className="w-full h-full p-5 rounded-3xl bg-transparent">
                {schedulesToShow.map((agendamento, index) => (
                  <div key={index} className="grid grid-cols-3 w-full py-2">
                    <div className="flex justify-start items-center">
                      <IonIcon
                        className={`w-7 h-7 ${
                          agendamento.status === "pending"
                            ? "text-orange-700"
                            : "text-green-700"
                        }`}
                        src={checkmarkCircle}
                      />
                    </div>
                    <IonLabel className="text-gray-500">
                      {agendamento.name}
                    </IonLabel>
                    <div className="flex justify-end items-center">
                      <IonLabel className="mr-3 text-gray-500">
                        {agendamento.times[0]}
                      </IonLabel>
                    </div>
                  </div>
                ))}
              </IonList>
            </div>
          </div>
        </IonContent>
      )}
      {sessionUser === null && (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
          <p className="text-black">voc?? precisa estar logado</p>
          <Link to="/signup" className="text-cyan-500">
            Clique aqui
          </Link>
        </div>
      )}
    </IonPage>
  );
};

export default Home;
