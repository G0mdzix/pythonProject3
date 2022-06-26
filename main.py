from datetime import datetime

import matplotlib.pyplot as plt
import uvicorn
from bokeh.layouts import column, row
from bokeh.models import CustomJS, Slider, CheckboxGroup, PreText, TextInput

import numpy as np
from bokeh.plotting import ColumnDataSource, figure, show
from fastapi import FastAPI, Request
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

from dummyData import dummySetpoints, dummyHistoricalData, backgroundTemperature, exampleSimulation, exampleSimulation2

# Wzor nagrzewnicy: Q = V·ρ·cp·ΔT [kW]
# V – strumień objętości powietrza [m³/s]; = u_n?
# ρ – gęstość powietrza [1,2 kg/m³];
# cp – ciepło właściwe powietrza [1,005 kJ/(kg·K);
# ΔT – różnica temperatur powietrza przed i za nagrzewnicą [°C]. - to bedzie nasz blad regulacji

# V - objetosc najwiekszego terrarium jakie znalazlem na necie to 1,44 m³, 150 x 80 x 120 cm
# ρ - wartosc stala 1,2 kg/m³
# cp - wartosc stala [1,005 kJ/(kg·K)
# ΔT – roznica temperatur czyli do zmiennych nalezy dodac np.: T1 i T2

# nizej polaczenie z MySQL
# import mysql.connector
#
# mydb = mysql.connector.connect(
#     host="localhost",
#     user="iss",
#     password="iss",
#     database="iss_projekt"
# )
#
# mycursor = mydb.cursor()
#
# mycursor.execute("SELECT * FROM ambienttemp")
#
# myresult = mycursor.fetchall()

# for x in myresult:
#     print("czas: ", x[1], "temperatura: ", x[2])

# gęstość powietrza [1,2 kg/m³]
A = 1.2
# ciepło właściwe powietrza [1,005 kJ/(kg·K)
B = 1.005
# okres probkowania (sekundy)
T_p = 300
# czas symulacji (sekundy)
Tsim = 86400
# ilość probek
N = int(Tsim / T_p)
# wartość zadana
h_target = 23
# strumień objętości powietrza [m³/s]
u_n = 1.44
# maksymalna temperatura w terrarium - hard ograniczenie nagrzewnicy
h_max = 30
# stałe wzmocnienie regulatora
k_p = 20
# czas zdwojenia
T_i = 1.5
# czas wyprzedzenia
T_d = 2.5
# natężenie dopływu
# Qd = 0.005 * u_n

h_list = [20.0, 20.0]
e_0 = h_target - h_list[0]
# to jest nasze delta T
e_list = [e_0]
u_n_list = [u_n]


def reset_values():
    h_list.clear()
    h_list.append(4.0)
    h_list.append(4.0)
    e_list.clear()
    u_n_list.clear()
    e_list.append(e_0)
    u_n_list.append(u_n)


def regulation_error(i):
    return h_target - h_list[i]


def calc_res(n):
    regulation_error_sum = 0
    for k in range(1, n):
        regulation_error_sum += e_list[k]
    return regulation_error_sum


def calc_current(i):
    return k_p * (e_list[i] + (T_p / T_i) * calc_res(i) + (T_d / T_p) * (e_list[i] - e_list[i - 1]))


def calc_doplyw(u_n):
    return 0.005 * u_n


def generate_PID_data():
    reset_values()
    for i in range(1, N):
        # e_list.append(regulation_error(i))
        e_list.append(h_target - h_list[i])

        # u_n = calc_current(i)
        u_n = k_p * (e_list[i] + (T_p / T_i) * calc_res(i) + (T_d / T_p) * (e_list[i] - e_list[i - 1]))
        # u_n_list.append(u_n)
        u_n_list.append(u_n)
        # Qd = calc_doplyw(u_n_list[-1])
        Qd = u_n_list[-1]
        # Wzor nagrzewnicy: Q = V·ρ·cp·ΔT [kW] Q = T_p*A*B*u_n*e_list[i]
        # h_new = (T_p / A) * (Qd - B * math.sqrt(h_list[-1])) + h_list[-1]
        h_new = T_p * A * B * u_n * e_list[i]
        if h_new < 0:
            h_new = 0
        if h_new > h_max:
            h_new = h_max
        h_list.append(h_new)
    print(h_list)
    print("PID data ok")


def plot_draw():
    fig, (ax1, ax2) = plt.subplots(nrows=2, sharex=True)
    ax3 = fig.add_subplot(111, zorder=-1)
    for _, spine in ax3.spines.items():
        spine.set_visible(False)
    ax3.tick_params(labelleft=False, labelbottom=False, left=False, right=False)
    ax3.get_shared_x_axes().join(ax3, ax1)
    ax3.grid(axis="x")

    wykres_wysokosc = ax1.plot(h_list, color='b', label="1 row")
    ax1.set_title('Height(t) - wysokosc cieczy w zbiorniku')
    ax1.set_xlabel('Sample No')
    ax1.set_ylabel('Height')
    wykres_uchyb = ax2.plot(e_list, color='b', label="1 row")
    ax2.set_title('Error value(t) - uchyb')
    ax2.set_xlabel('Sample No')
    ax2.set_ylabel('Error value (h(t) - h_target)')

    ax1.grid()
    ax2.grid()
    plt.subplots_adjust(left=0.1,
                        bottom=0.1,
                        right=0.9,
                        top=0.9,
                        wspace=0.4,
                        hspace=0.25)
    plt.show()


def pid_local_matplotlib():
    generate_PID_data()
    plot_draw()


def pid_bokeh():
    generate_PID_data()
    N = int(Tsim / T_p)
    t = np.linspace(0, N, N + 1)
    print(h_list)
    h = h_list[:]

    my_dict = dict(t=t, h=h)

    source = ColumnDataSource(data=dict(t=t, h=h))

    plot = figure(x_range=(0, N), y_range=(0, 35), width=400, height=400)

    plot.line('t', 'h', source=source, line_width=3, line_alpha=0.6)

    h_target_slider = Slider(start=15, end=30, value=25, step=1, title="h_target")
    h_0_slider = Slider(start=0, end=50, value=4, step=.1, title="h_0")
    u_n_slider = Slider(start=0, end=100, value=5, step=.1, title="u_n")
    k_p_slider = Slider(start=0.01, end=200.0, value=20.0, step=0.01, title="k_p")
    t_p_slider = Slider(start=300, end=600, value=300, step=300, title="T_p")  # constant for now.
    t_i_slider = Slider(start=1, end=50, value=1.5, step=0.1, title="T_i")
    t_d_slider = Slider(start=1, end=50, value=2.5, step=0.1, title="T_d")

    callback = CustomJS(
        args=dict(source=source, h_target=h_target_slider, h_0=h_0_slider, u_n=u_n_slider, k_p=k_p_slider,
                  T_p=t_p_slider, T_i=t_i_slider, T_d=t_d_slider),
        code="""
                const data = source.data;
                const t = data['t']
                const h = data['h']

                const hTarget = h_target.value;
                const Tsim = 86400;
                const h0 = h_0.value;
                const Tp = T_p.value;
                const Ti = T_i.value;
                const Td = T_d.value;
                const kp = k_p.value;
                let u_n_list = [u_n.value];
                const h_max = 30;
                const A = 1.2;
                const B = 1.005;

                h[0] = h0;
                h[1] = h0;

                let N = parseInt( Tsim / Tp )
                let e_0 = hTarget - h[0]
                let e_list = [e_0]

                for (let i = 1; i < N; i++) {
                    e_list.push(hTarget - h[i])
                    let regulation_error_sum = 0
                    for (let k = 0; k < i; k++) {
                        regulation_error_sum += e_list[k]
                    }
                    u_n = kp * (e_list[i] + (Tp / Ti) * regulation_error_sum + (Td / Tp) * (e_list[i] - e_list[ i - 1 ]))
                    u_n_list.push(u_n)
                    let Qd = u_n

                    let last_ind = i

                    let h_new = T_p * A * B * Qd * e_list[i]

                    if (h_new < 0) {
                        h_new = 0
                    }   
                    if( h_new > h_max) {
                        h_new = h_max
                    }
                    console.log(h_new)
                    h[i + 1] = h_new
                }

                source.change.emit()
            """)

    h_target_slider.js_on_change('value', callback)
    h_0_slider.js_on_change('value', callback)
    u_n_slider.js_on_change('value', callback)
    k_p_slider.js_on_change('value', callback)
    t_p_slider.js_on_change('value', callback)
    t_i_slider.js_on_change('value', callback)
    t_d_slider.js_on_change('value', callback)

    pre = PreText(text="""Check if you want to type your own parameters values. """,
                  width=200, height=20)

    LABELS = ["h_target", "h_0", "u_n", "k_p", "T_p", "T_i", "T_d"]

    checkbox_group = CheckboxGroup(labels=LABELS, active=[0, 1])
    checkbox_group.js_on_click(CustomJS(code="""
        for(let i = 0; i < this.labels.length; i++) {
            if(this.active.includes(i)) {
                console.log(this.labels[i] + ' active')
            } else {
                console.log(this.labels[i] + ' not active')
            }

        }
        console.log('checkbox_group: active=' + this.active, this.toString())
    """))

    h_target_input = TextInput(value="default", title="h_target")
    h_0_input = TextInput(value="default", title="h_0_input:")
    u_n_input = TextInput(value="default", title="u_n_input")
    k_p_input = TextInput(value="default", title="k_p_input")
    t_p_input = TextInput(value="default", title="t_p_input")
    t_i_input = TextInput(value="default", title="t_i_input")
    t_d_input = TextInput(value="default", title="t_d_input")

    inputs = [h_target_input, h_0_input, u_n_input, k_p_input, t_p_input, t_i_input, t_d_input]

    layout = row(
        plot,
        column(
            h_target_slider,
            h_0_slider,
            u_n_slider,
            k_p_slider,
            t_p_slider,
            t_i_slider,
            t_d_slider),
        column(
            pre,
            row(checkbox_group, column(inputs))
        )
    )

    show(layout)


origins = ["*"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setpoint_list = dummySetpoints
historicalData = dummyHistoricalData

# todo zapis/odczyt z bazy
counter = 0


@app.get("/setpoints")
async def get_setpoints():
    return setpoint_list


@app.post("/setpoints")
async def get_setpoints(new_setpoints: Request):
    results = await new_setpoints.json()
    global setpoint_list
    setpoint_list = results


@app.get("/historical")
async def get_historical():
    return dummyHistoricalData


@app.get("/background")
async def get_background():
    return backgroundTemperature


@app.put("/")
async def run(params: Request):
    global counter
    global dummyHistoricalData

    results = await params.json()
    setpoints = results['setpoint']
    v = results['v']
    k_p = results['k_p']
    t_p = results['t_p']
    t_d = results['t_d']
    t_i = results['t_i']

    newParams = {
        "v": v, "k_p": k_p, "t_p": t_p, "t_i": t_d, "t_d": t_i
    }

    newHistoricalData = exampleSimulation

    for i in range(len(setpoints)):
        newHistoricalData[i]["Setpoint"] = setpoints[i]
        newHistoricalData[i]["Background"] = backgroundTemperature[i]["Temperature"]

    newHistorical = {"Date": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                     "Parameters": newParams,
                     "Data": newHistoricalData}  # todo wywołać symulację i zapisać dane
    dummyHistoricalData.append(newHistorical)

    return exampleSimulation


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info")
