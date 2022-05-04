import matplotlib.pyplot as plt
import math
from bokeh.layouts import column, row
from bokeh.models import CustomJS, Slider, CheckboxGroup, PreText, TextInput

import numpy as np
from bokeh.plotting import ColumnDataSource, figure, show

# pole powierzchni przekroju poprzecznego zbiornika
A = 1.5
# współczynnik beta
B = 0.035
# okres probkowania
T_p = 0.1
# czas symulacji
Tsim = 360
# ilość probek
N = int(Tsim / T_p)
# wartość zadana
h_target = 1.5
u_n = 5
# maksymalna wysokosc cieczy w zbiorniku
h_max = 5
# ???
k_p = 20
# ???
T_i = 1.5
# ???
T_d = 2.5
# natężenie dopływu
Qd = 0.005 * u_n

h_list = [4.0, 4.0]
e_0 = h_target - h_list[0]
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
        Qd = 0.005 * u_n_list[-1]

        h_new = (T_p / A) * (Qd - B * math.sqrt(h_list[-1])) + h_list[-1]
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

    plot = figure(x_range=(0, N), y_range=(0, 5), width=400, height=400)

    plot.line('t', 'h', source=source, line_width=3, line_alpha=0.6)

    h_target_slider = Slider(start=0, end=5, value=1.5, step=.1, title="h_target")
    h_0_slider = Slider(start=0, end=5, value=4, step=.1, title="h_0")
    u_n_slider = Slider(start=0, end=10, value=5, step=.1, title="u_n")
    k_p_slider = Slider(start=0.01, end=20.0, value=20.0, step=0.01, title="k_p")
    t_p_slider = Slider(start=0.01, end=2.00, value=0.1, step=0.01, title="T_p")
    t_i_slider = Slider(start=1, end=5, value=1.5, step=0.1, title="T_i")
    t_d_slider = Slider(start=1, end=5, value=2.5, step=0.1, title="T_d")

    callback = CustomJS(
        args=dict(source=source, h_target=h_target_slider, h_0=h_0_slider, u_n=u_n_slider, k_p=k_p_slider,
                  T_p=t_p_slider, T_i=t_i_slider, T_d=t_d_slider),
        code="""
                const data = source.data;
                const t = data['t']
                const h = data['h']

                const hTarget = h_target.value;
                const Tsim = 360;
                const h0 = h_0.value;
                const Tp = T_p.value;
                const Ti = T_i.value;
                const Td = T_d.value;
                const kp = k_p.value;
                let u_n_list = [u_n.value];
                const h_max = 5;
                const A = 1.5;
                const B = 0.035;

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
                    let Qd = 0.005 * u_n

                    let last_ind = i

                    let h_new = (Tp / A) * (Qd - B * Math.sqrt( h[last_ind] )) + h[last_ind]

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


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    pid_local_matplotlib()

    pid_bokeh()



