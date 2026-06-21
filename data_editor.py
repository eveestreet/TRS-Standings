import json
import tkinter as tk
from tkinter import ttk, messagebox
import copy

DRIVERS_FILE = "data/drivers.json"
TEAMS_FILE = "data/teams.json"

POINTS_SYSTEM = [20,17,15,12,10,9,8,7,6,5,4,3,2,1]

def smart_number(value):
    num = float(value)
    if num.is_integer():
        return int(num)
    return num


def load_json(path):
    with open(path, "r") as file:
        return json.load(file)


def save_json(path, data):
    with open(path, "w") as file:
        json.dump(data, file, indent=4)


class ChampionshipManager:

    def __init__(self, root):

        self.root = root
        self.root.title("Championship Manager")
        self.root.geometry("1000x650")

        self.drivers = load_json(DRIVERS_FILE)
        self.teams = load_json(TEAMS_FILE)

        self.filtered_drivers = self.drivers

        self.history = []

        self.create_tabs()

    # ---------------------

    def save_state(self):
        self.history.append(copy.deepcopy(self.drivers))

    # ---------------------

    def undo(self):

        if not self.history:
            messagebox.showinfo("Undo", "Nothing to undo")
            return

        self.drivers = self.history.pop()
        self.filtered_drivers = self.drivers
        self.populate_drivers()

    # ---------------------

    def create_tabs(self):

        notebook = ttk.Notebook(self.root)
        notebook.pack(fill="both", expand=True)

        self.drivers_tab = tk.Frame(notebook)
        self.teams_tab = tk.Frame(notebook)

        notebook.add(self.drivers_tab, text="Drivers")
        notebook.add(self.teams_tab, text="Teams")

        self.create_drivers_tab()
        self.create_teams_tab()

    # =====================================================
    # DRIVERS TAB
    # =====================================================

    def create_drivers_tab(self):

        search_frame = tk.Frame(self.drivers_tab)
        search_frame.pack(pady=5)

        tk.Label(search_frame, text="Search Driver").pack(side=tk.LEFT)

        self.search_entry = tk.Entry(search_frame)
        self.search_entry.pack(side=tk.LEFT)

        tk.Button(search_frame, text="Search", command=self.search_driver).pack(side=tk.LEFT)
        tk.Button(search_frame, text="Reset", command=self.reset_search).pack(side=tk.LEFT)

        columns = ("Name","Role","Team","Principal","Points","Podiums","Wins","Attendance")

        self.driver_table = ttk.Treeview(
            self.drivers_tab,
            columns=columns,
            show="headings"
        )

        for col in columns:
            self.driver_table.heading(col, text=col)
            self.driver_table.column(col, width=110)

        self.driver_table.pack(pady=10, fill="x")

        form = tk.Frame(self.drivers_tab)
        form.pack(pady=10)

        labels = [
            ("Name","name"),
            ("Role","role"),
            ("Team","team"),
            ("Principal","principal"),
            ("Points","points"),
            ("Podiums","podiums"),
            ("Wins","wins"),
            ("Attendance","attendance")
        ]

        self.driver_entries = {}

        for i,(label,key) in enumerate(labels):

            tk.Label(form,text=label).grid(row=i,column=0)

            if key == "points":
                entry = ttk.Combobox(form, values=POINTS_SYSTEM, width=18)
            else:
                entry = tk.Entry(form, width=20)

            entry.grid(row=i, column=1)
            self.driver_entries[key] = entry
            
        tk.Button(self.drivers_tab,text="Edit Driver",command=self.edit_driver).pack(pady=2)
        tk.Button(self.drivers_tab,text="Undo",command=self.undo).pack(pady=2)
        tk.Button(self.drivers_tab,text="Save Drivers",command=self.save_drivers).pack(pady=2)
        tk.Button(self.drivers_tab,text="Add Race Result",command=self.add_race_result).pack(pady=2)

        self.populate_drivers()

    # ---------------------

    def populate_drivers(self):

        for row in self.driver_table.get_children():
            self.driver_table.delete(row)

        for d in self.filtered_drivers:

            self.driver_table.insert("", "end", values=(

                d["name"],
                d["role"],
                d["team"],
                d["principal"],
                d["points"],
                d["podiums"],
                d["wins"],
                d["attendance"]

            ))

    # ---------------------

    def get_selected_driver(self):

        selected = self.driver_table.selection()

        if not selected:
            messagebox.showwarning("Warning","Select a driver")
            return None

        index = self.driver_table.index(selected[0])
        return self.filtered_drivers[index]

    # ---------------------

    def edit_driver(self):

        driver = self.get_selected_driver()

        if not driver:
            return

        self.save_state()

        try:

            for key,entry in self.driver_entries.items():

                value = entry.get()

                if value == "":
                    continue

                if key in ["points"]:
                    driver[key] = smart_number(value)

                elif key in ["podiums","wins","attendance"]:
                    driver[key] = int(value)

                else:
                    driver[key] = value

            self.populate_drivers()

        except ValueError:
            messagebox.showerror("Error","Invalid number")
            
    # ---------------------
    # ---------------------
    # ---------------------
    # ---------------------
    # ---------------------
    # ---------------------
    def add_race_result(self):

        driver = self.get_selected_driver()

        if not driver:
            return

        value = self.driver_entries["points"].get()

        if value == "":
            messagebox.showwarning("Warning", "Select finishing position")
            return

        try:
            points = int(value)

            self.save_state()

            driver["points"] += points
            driver["attendance"] += 1

            # Optional manual increments
            if self.driver_entries["wins"].get() == "1":
                driver["wins"] += 1

            if self.driver_entries["podiums"].get() == "1":
                driver["podiums"] += 1

            # Team stats
            for team in self.teams:
                if team["name"] == driver["team"]:
                    team["points"] += points
                    if self.driver_entries["wins"].get() == "1":
                        team["wins"] += 1
                    break

            self.populate_drivers()
            self.populate_teams()

            self.driver_entries["points"].delete(0, tk.END)
            self.driver_entries["wins"].delete(0, tk.END)
            self.driver_entries["podiums"].delete(0, tk.END)

        except ValueError:
            messagebox.showerror("Error", "Invalid number")
            
            
    def search_driver(self):

        text = self.search_entry.get().lower()

        self.filtered_drivers = [

            d for d in self.drivers
            if text in d["name"].lower()

        ]

        self.populate_drivers()

    # ---------------------

    def reset_search(self):

        self.filtered_drivers = self.drivers
        self.populate_drivers()

    # ---------------------

    def save_drivers(self):

        save_json(DRIVERS_FILE,self.drivers)
        messagebox.showinfo("Saved","Drivers saved")

    # =====================================================
    # TEAMS TAB
    # =====================================================

    def create_teams_tab(self):

        columns = ("Name","Principal","Points","Wins")

        self.team_table = ttk.Treeview(
            self.teams_tab,
            columns=columns,
            show="headings"
        )

        for col in columns:
            self.team_table.heading(col,text=col)
            self.team_table.column(col,width=150)

        self.team_table.pack(pady=10)

        form = tk.Frame(self.teams_tab)
        form.pack(pady=10)

        labels = [

            ("Name","name"),
            ("Principal","principal"),
            ("Points","points"),
            ("Wins","wins")

        ]

        self.team_entries = {}

        for i,(label,key) in enumerate(labels):

            tk.Label(form,text=label).grid(row=i,column=0)

            entry = tk.Entry(form,width=20)
            entry.grid(row=i,column=1)

            self.team_entries[key] = entry

        tk.Button(self.teams_tab,text="Edit Team",command=self.edit_team).pack(pady=2)
        tk.Button(self.teams_tab,text="Save Teams",command=self.save_teams).pack(pady=2)

        self.populate_teams()

    # ---------------------

    def populate_teams(self):

        for row in self.team_table.get_children():
            self.team_table.delete(row)

        for t in self.teams:

            self.team_table.insert("", "end", values=(

                t["name"],
                t["principal"],
                t["points"],
                t["wins"]

            ))

    # ---------------------

    def get_selected_team(self):

        selected = self.team_table.selection()

        if not selected:
            messagebox.showwarning("Warning","Select a team")
            return None

        index = self.team_table.index(selected[0])
        return self.teams[index]

    # ---------------------

    def edit_team(self):

        team = self.get_selected_team()

        if not team:
            return

        try:

            for key,entry in self.team_entries.items():

                value = entry.get()

                if value == "":
                    continue

                if key in ["points","wins"]:
                    team[key] = int(value)
                else:
                    team[key] = value

            self.populate_teams()

        except ValueError:
            messagebox.showerror("Error","Invalid number")

    # ---------------------

    def save_teams(self):

        save_json(TEAMS_FILE,self.teams)
        messagebox.showinfo("Saved","Teams saved")


# ------------------------------------------------

if __name__ == "__main__":

    root = tk.Tk()

    app = ChampionshipManager(root)

    root.mainloop()