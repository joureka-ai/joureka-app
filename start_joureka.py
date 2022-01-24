import argparse
import os
import sys
from pathlib import Path
import subprocess
import platform
from dataclasses import dataclass
from typing import Union


@dataclass
class InstallStatus:
    """Class for keeping track of the status of the install process."""
    backend: bool = False
    db: bool = False
    minio: bool = False
    frontend: bool = False

@dataclass
class AppStatus:
    """Class for keeping track of the status of the app."""
    backend: bool = False
    db: bool = False
    minio: bool = False
    frontend: bool = False

install_status = InstallStatus()
app_status = AppStatus()

def store_username_password(username, password, db_password):
    filename = "user.env"
    with open(filename, "w") as f:
        f.write(f"FIRST_SUPERUSER={username}\n")
        f.write(f"FIRST_SUPERUSER_PASSWORD={password}\n")
        f.write(f"MINIO_ROOT_USER={username}\n")
        f.write(f"MINIO_ROOT_PASSWORD={password}\n")
        f.write(f"POSTGRES_PASSWORD={db_password}\n")
    print("\n")
    print(f"Deine Daten wurden in diesem Ordner gespeichert: {os.getcwd()}")

    if os.getcwd().rsplit("/", 1)[-1] != "joureka-app":
        print("\n")
        print(36*"!")
        print(f"!!! Falls dies nicht der Ordner sein sollte, wo auch die joureka App (Ordner mit dem Namen joureka-app) liegt, musst du die Datei {filename} dort hin verschieben! !!!")



def in_username():
    print("\n")
    username = input("Bitte gib deinen Benutzernamen in Form einer Email ein: ")
    if len(username) > 6 or "@" in username:
        print(2*"#"+" Perfekt, dass hat geklappt. " + 2*"#")
        return username
    else:
        print(2*"!" + " Achtung, dass hat nicht geklappt. Der Benutzername ist zu kurz oder enthält kein \"@\" . Bitte verwende einen Benutzernamen ähnlich wie diesen test@jourek.ai !")
        in_username()
    
def in_password():
    print("\n")
    password = input("Bitte gib dein Passwort - länger als 8 Zeichen - ein: ")
    if len(password) > 8:
        print(2*"#"+" Perfekt, dass hat geklappt. " + 2*"#")
        return password
    else:
        print(2*"!" + " Achtung, dass hat nicht geklappt. Das Passwort muss länger als 8 Zeichen sein.")
        in_password()

def in_db_password():
    print("\n")
    password = input("Bitte gib dein Passwort für die Datenbank - länger als 16 Zeichen - ein: ")
    if len(password) > 16:
        print(2*"#"+" Perfekt, dass hat geklappt. " + 2*"#")
        return password
    else:
        print(2*"!" + " Achtung, dass hat nicht geklappt. Das Passwort muss länger als 16 Zeichen sein.")
        in_password()



def check_for_docker_compose(ops: str):
    try:
    
        sub_1 = subprocess.check_output("docker -v", shell=True)
        sub_2 = subprocess.check_output("docker-compose -v", shell=True)
    
        return b"build" in sub_1 and sub_2
    
    except Exception as e:
        print(e)
        print(12*"!!"+" Es wird docker und docker-compose benötigt! " + 12*"!!")    
        print(12*"!!"+" Bitte installiere für deine jeweiliges Betriebssystem! " + 12*"!!")   
        if ops == "Mac":
            print(12*"!!"+" Docker - Installation für MAC: https://docs.docker.com/desktop/mac/install/  " + 12*"!!")   

        if ops == "Windows":
            print(12*"!!"+" Docker - Installation für Windows: https://docs.docker.com/desktop/windows/install/  " + 12*"!!")   

        if ops == "Linux":
            print(12*"!!"+" Docker - Installation für Ubuntu (Linux): https://docs.docker.com/engine/install/ubuntu/  " + 12*"!!")   
            print(12*"!!"+" Docker-Compose - Installation für Ubuntu (Linux) unter dem Reiter Linux: https://docs.docker.com/compose/install/  " + 12*"!!")   



def check_for_user_env():
    list_files = os.listdir()
    return "user.env" in list_files

def check_repo_integ():
    list_files = os.listdir()
    nec_files = [".env", "backend", "frontend", "minio", "scripts", "docker-compose.yml"]

    tmp_bool = [f in list_files for f in nec_files]

    return set(tmp_bool) == {True}

def install_joureka():
    subprocess.run(
            [
                "docker-compose",
                "up"
            ],
            capture_output=True,
        )

def update_install_status(line: str, install_status: InstallStatus):
    if "backend_1" in line:
        install_status.backend = True

    if "db_1" in line:
        install_status.db = True

    if "minio_1" in line:
        install_status.minio = True

    if "frontend_1" in line:
        install_status.frontend = True

def update_status(line: str, app_status: AppStatus):
    if "backend_1" and "Application startup complete." in line:
        app_status.backend = True

    if "db_1" and "database system is ready" in line:
        app_status.db = True

    if "minio_1" and "Browser Access" in line:
        app_status.minio = True

    if "frontend_1" and "Ready on port" in line:
        app_status.frontend = True


def check_status(app_status: Union[AppStatus, InstallStatus]):

    stat_dict = app_status.__dict__
    tmp_stat = [stat_dict[app_part] for app_part in stat_dict]

    return set(tmp_stat) == {True}

def stop_app():
    print("\n")
    answer = input("Falls du die App beenden möchtest, antworte mit \"JA\": ")
    if answer == "JA":
        subprocess.check_call("docker-compose stop", shell=True)
        exit()

def print_status(app_status: AppStatus, c: int):
        if c % 100 == 0:
            if not app_status.backend:
                print(2*"#" + " Das Rückgrat für die Datenverabeitung wird noch gestartet ... ")
            if app_status.backend:
                print(2*"#" + " Das Rückgrat läuft!")

            if not app_status.minio or not app_status.db:
                print(2*"#" + " Die Datenbank wird noch gestartet ...")
            if app_status.minio and app_status.db:
                print(2*"#" + " Die Datenbank läuft!")

            if not app_status.frontend:
                print(2*"#" + " Die grafische Oberfläche wird noch gestartet ...")
            if app_status.frontend:
                print(2*"#" + " Das grafische Oberfläche läuft!")


def install_status(line: str, c: int, installed: bool):
    
    update_install_status(line, install_status)
    installed = check_status(install_status)

    if c % 300 == 0 and not installed:
        print(2*"#"+" joureka wird installiert, dies kann eine Weile dauern! " + 2*"#")
        print(2*"#"+" Du hast wahrscheinlich Zeit einen oder zwei Kaffee zu trinken! " + 2*"#")
    
    
    if installed:
        print(2*"#"+" joureka ist installiert! " + 2*"#")
        print(2*"#"+" Habe nur noch kurz Geduld, innerhalb von wenigen Sekunden kannst du joureka verwenden. " + 2*"#")
        print("\n")

    return installed


if __name__ == "__main__":
    print("\n")
    print("\n")
    print(64*"#")
    print(12*"#"+" Willkommen bei der joureka App! " + 12*"#")
    print(64*"#")
    print("\n")

    if not check_repo_integ():
        print(12*"!!"+" Leider fehlen nötige Dateien um joureka App zu starten, bitte kopiere den joureka-App Ordner neu mit dem Befehl in der Kommandozeile: \"git clone git@github.com:joureka-ai/joureka-app.git\" " + 12*"!!")   

    else:
        #print("Test")
        operating_system = platform.system()
        if "Linux" in operating_system:
            ops = "Linux"
        if "Windows" in operating_system:
            ops = "Windows"
        if "Darwin" in operating_system:
            ops = "Mac"
        
        
        if not check_for_user_env():
            print(2*"#"+" Bevor es los gehen kann, benötigen wir einige Informationen von dir! ")
            print(2*"#"+" Dies sind persönliche Daten, welche auf deinem PC in einer Datei Namens user.env gespeichert werden. ")
            print(2*"#"+" Ohne diese Daten kannst du die App nicht starten und kommst nicht an deine gespeicherten Interviews und Daten. ")
            print(2*"#"+" Gehe also bewusst mit diesen Daten um! ")
            print("\n")

            # Get the necesary credentials
            username = in_username()
            password = in_password()
            db_password = in_db_password()
        
            store_username_password(username, password, db_password)

    

        if not check_for_docker_compose(operating_system):

            print(12*"!!"+" Die Installation musste abgebrochen werden! "  + 12*"!!")  
            exit()

        else:
            print("Test")
            # s = subprocess.check_output("docker-compose up", shell=True)
            popen = subprocess.Popen(["docker-compose", "up"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

            c = 0
            installed = False

            """
            if popen.stderr.write():
                print("Leider ist ein Fehler aufgetreten")
                print(popen.stderr.write())
            """
            
            for line in iter(popen.stdout.readline, ''):
                
                if not installed:
                    # For debugging
                    #print(f"NNNIII: {line}")
                    installed = install_status(line, c, installed)
                
                if installed:
                    # For debugging
                    #print(f"IIIII: {line}")
                    update_status(line, app_status)

                    print_status(app_status, c)

                    if check_status(app_status):
                        print("\n")
                        print(64*"#")
                        print(12*"#"+" joureka App läuft jetzt! " + 12*"#")
                        print(12*"#"+" Bitte gebe die folgende Adresse in deinem Browser ein: http://localhost:3000 " + 12*"#")
                        print(64*"#")

                        popen.stdout.close()
                        stop_app()
                    
                c += 1            


