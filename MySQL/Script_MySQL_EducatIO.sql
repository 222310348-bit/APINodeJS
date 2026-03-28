CREATE DATABASE EducatIO;
USE EducatIO;

CREATE TABLE Roles(
IdRol_PK int auto_increment primary key,
TipoRol varchar(50) not null);

CREATE TABLE Usuarios (
IdUsuario_PK int auto_increment primary key,
NombresU varchar(70) not null,
ApellidosU varchar(70) not null,
Correo varchar(50) not null,
Contraseña varchar(20) not null,
IdRol_FK int,
foreign key (IdRol_FK) references Roles (IdRol_PK));

CREATE TABLE Clases(
IdClase_PK varchar(10) primary key,
NombreC varchar(70) not null,
Codigo varchar(50));

CREATE TABLE Asistencia(
IdAsistencia_PK int auto_increment primary key,
Fecha DATE not null,
Hora TIME not null,
Estado char(1) not null, check (Estado in ('A','F','J')),  /*A=Asistencia, F=Falta, J= Justificada*/
IdClase_FK varchar(10) not null,
IdUsuario_FK int not null,
foreign key (IdClase_FK) references Clases (IdClase_PK),
foreign key (IdUsuario_FK) references Usuarios (IdUsuario_PK));

CREATE TABLE Usuario_Clase(
IdUsCla int auto_increment primary key,
IdUsuario_FK int,
IdClase_FK varchar(10),
foreign key (IdUsuario_FK) references Usuarios(IdUsuario_PK),
foreign key (IdClase_FK) references Clases(IdClase_PK));

INSERT INTO Roles(TipoRol) Values ("Administrador"),("Estudiante"),("Docente");

INSERT INTO Usuarios(NombresU,ApellidosU,Contraseña,Correo,IdRol_FK) Values 
("Luis Alberto","Astorga Esquivel","1234","222310304@itslerdo.edu.mx", 2),
("Brian Aljeandro","Hernandez Cordero", "5678","222310645@itslerdo.edu.mx", 2),
("Edson Francisco","Lozano Chairez", "9876","222310348@itslerdo.edu.mx", 2);

INSERT INTO Clases() Values 
("SCC-1019","Programacion Logica y Funcional", "56VF1s"),
("GIB-2504","Conectividad a datos", "78uH6X"),
("GIB-2503","Gestion de servidores", "AS279D");

INSERT INTO Asistencia(Fecha,Hora,Estado,IdClase_FK,IdUsuario_FK) Values ("2026-03-10","13:10:00","A","SCC-1019",1),
("2026-03-10","15:10:00","J","GIB-2504",2),
("2026-03-10","15:10:12","A","GIB-2504",3);

INSERT INTO Usuario_Clase(IdUsuario_FK,IdClase_FK) Values (1,"SCC-1019"),(2,"GIB-2504"),(3,"GIB-2504");
