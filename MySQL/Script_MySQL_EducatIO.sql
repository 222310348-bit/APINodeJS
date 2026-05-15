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
Contraseña varchar(255) not null,
IdRol_FK int,
foreign key (IdRol_FK) references Roles (IdRol_PK));

CREATE TABLE Clases(
Codigo_PK varchar(10) primary key,
NombreC varchar(70) not null,
IdClase varchar(50) not null);

CREATE TABLE Asistencia(
IdAsistencia_PK int auto_increment primary key,
Fecha DATE not null,
Hora TIME not null,
Estado char(1) not null, check (Estado in ('A','F','J')),  /*A=Asistencia, F=Falta, J= Justificada*/
Codigo_FK varchar(10) not null,
IdUsuario_FK int not null,
foreign key (Codigo_FK) references Clases (Codigo_PK),
foreign key (IdUsuario_FK) references Usuarios (IdUsuario_PK));

CREATE TABLE Usuario_Clase(
IdUsCla int auto_increment primary key,
IdUsuario_FK int,
Codigo_FK varchar(10),
foreign key (IdUsuario_FK) references Usuarios(IdUsuario_PK),
foreign key (Codigo_FK) references Clases(Codigo_PK));

INSERT INTO Roles(TipoRol) Values ('Administrador'),('Estudiante'),('Docente');	

INSERT INTO Usuarios(NombresU,ApellidosU,Contraseña,Correo,IdRol_FK) Values 
('Luis Alberto','Astorga Esquivel','1234','222310304@itslerdo.edu.mx', 2),
('Brian Aljeandro','Hernandez Cordero', '1234','222310645@itslerdo.edu.mx', 2),
('Edson Francisco','Lozano Chairez', '1234','222310348@itslerdo.edu.mx', 2),
('Kara Veronica','Rodriguez Lozano', '1234','KVRL38@itslerdo.edu.mx', 3),
('Miguel Alejandro','Garcia Nuñuez', '1234','MAGN38@itslerdo.edu.mx', 1);

INSERT INTO Clases(IdClase,NombreC,Codigo_PK) Values 
('SCC-1019','Programacion Logica y Funcional', '56VF1s'),
('GIB-2504','Conectividad a datos', '78uH6X'),
('GIB-2503','Gestion de servidores', 'AS279D');

INSERT INTO Asistencia(Fecha,Hora,Estado,Codigo_FK,IdUsuario_FK) Values ('2026-03-10','13:10:00','A','56VF1s',1),
('2026-03-10','15:10:00','J','78uH6X',2),
('2026-03-10','15:10:12','A','78uH6X',3);

INSERT INTO Usuario_Clase(IdUsuario_FK,Codigo_FK) Values (1,'56VF1s'),(2,'78uH6X'),(3,'78uH6X'),(1,'78uH6X');

select * from roles;
/*Insert nuevos*/
INSERT INTO Usuarios(NombresU,ApellidosU,Contraseña,Correo,IdRol_FK) Values 
('Jose Angel','Candelas Saucedo','1234','JACS14@itslerdo.edu.mx', 3);

INSERT INTO Usuario_Clase(IdUsuario_FK,Codigo_FK) Values (4,'56VF1s'),(4,'78uH6X'),(6,'AS279D');