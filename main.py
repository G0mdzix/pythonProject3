from math import sqrt
import matplotlib.pyplot as plt
from bokeh.plotting import figure, show
import numpy as np
import xlwings as xw
import csv
import pandas as pd


A = 1.2
B = 1.005
Tp = 0.1
Tsim = 3600
N = int(Tsim / Tp)
u_0 = 1.44
h_target = 26

P_s = 0.15
k = 0.9
m = 1.2
c = 1.005
L = 0.006 #m w mm 6

k_p = 20 #
T_i = 5.5 #
T_d = 5.5 #

h_list = []

import csv

with open("Zeszyt1.csv") as file:
  csvreader = csv.reader(file)
  print(csvreader)
  print("test@@@@@@@@@@@@@@@@@@@@@@@")
  for row in csvreader:
    #print(row[0])
    h_list.append(row[0])

print(float(h_list[0]) - 15)




e_0 = (h_target - float(h_list[0]))
e_list = [e_0]
u_n_list = [u_0]

def get_Qd(u_t):
   return 0.005 * u_t

   # for i in range(N, 287):
    #    return Tp * A * B * u_t * e_list[i]

def calc_res(n):
    regulation_error_sum = 0
    for k in range(1, n):
        regulation_error_sum += e_list[k]
    return regulation_error_sum



def H_loop(h0,u_n):
   # h_list.append(h0)
    u_t = u_0
    for i in range(N):
        e_list.append((h_target - float(h_list[i])))
        u_n = k_p * (e_list[i] + (Tp / T_i) * calc_res(i) + (T_d / Tp) * (e_list[i] - e_list[i - 1]))
        # Wzor nagrzewnicy: Q = V·ρ·cp·ΔT [kW] Q = T_p*A*B*u_n*e_list[i]
       # Qd = 0.005 * u_n_list[-1]
       # temp = Tp * A * B * u_n * e_list[i]
        temp = ((-P_s * k * (e_list[i]/L) + get_Qd(u_t))/ m * c) - float(h_list[i - 1])
       # temp = Tp / A * (get_Qd(u_t) - B * sqrt(h_list[0][-1][0])) + h_list[0][-1][0]
        #temp = Tp / A * (get_Qd(u_t) - B * sqrt(float(h_list[-1]))) + float(h_list[-1])
        if temp < 0:  #0
            h_list.append(25)
        elif temp > 5:  #5
            h_list.append(26)
        else:
            h_list.append(temp)
        u_t = u_t+u_n/N



def H_list_show():
    for x in range(len(h_list)):
        print(x, " ", h_list[x])


def Figure():
    p = figure(title="Wykres h", x_axis_label='N', y_axis_label='h')
    p.line(list(range(0, N + 1)),h_list ,legend_label="Wykres", color="blue", line_width=2)
    show(p)


def main():
    h0 = 25.0
    u_n = 15.0
    H_loop(h0,u_n)
    Figure()
    #print(e_list)


main()


#  temp = Tp / A * (get_Qd(u_t) - B * sqrt(h_list[0][-1][0])) + h_list[0][-1][0]