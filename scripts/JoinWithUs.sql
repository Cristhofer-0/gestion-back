-- Crear base de datos
CREATE DATABASE JoinWithUs;
GO

USE JoinWithUs;
GO

-- Tabla de Usuarios
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(150) NOT NULL,
    BirthDate DATE NOT NULL,
    Phone NVARCHAR(20) NOT NULL,
    DNI NVARCHAR(20) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) CHECK (Role IN ('user', 'organizer', 'admin')) NOT NULL,
    VerifiedOrganizer BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Tabla de Eventos
CREATE TABLE Events (
    EventId INT IDENTITY(1,1) PRIMARY KEY,
    OrganizerId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    Address NVARCHAR(255),
    Latitude DECIMAL(10,7),
    Longitude DECIMAL(10,7),
    Visibility NVARCHAR(20) CHECK (Visibility IN ('public', 'private', 'invite-only')) NOT NULL,
    Categories NVARCHAR(255),
    BannerUrl NVARCHAR(255),
    VideoUrl NVARCHAR(255),
    Status NVARCHAR(20) CHECK (Status IN ('draft', 'pending_approval', 'published', 'cancelled')) DEFAULT 'draft',
    Capacity INT,
    createdAt  DATETIMEOFFSET,
    updatedAt  DATETIMEOFFSET,
    CONSTRAINT FK_Events_Users FOREIGN KEY (OrganizerId) REFERENCES Users(UserId)
);

  

-- Tabla de Tickets
CREATE TABLE Tickets (
    TicketId INT IDENTITY(1,1) PRIMARY KEY,
    EventId INT NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Description NVARCHAR(255),
    StockAvailable INT NOT NULL,
    createdAt  DATETIMEOFFSET,
    updatedAt DATETIMEOFFSET,
    CONSTRAINT FK_Tickets_Events FOREIGN KEY (EventId) REFERENCES Events(EventId)
);



-- Tabla de Pedidos (Orders)
CREATE TABLE Orders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    EventId INT NOT NULL,
    TicketId INT NOT NULL,
    Quantity INT NOT NULL,
    TotalPrice DECIMAL(10,2) NOT NULL,
    PaymentStatus NVARCHAR(20) CHECK (PaymentStatus IN ('paid', 'pending', 'refunded')) NOT NULL,
    CouponCode NVARCHAR(50),
    DiscountPercentage DECIMAL(5,2),
    OrderDate DATETIME DEFAULT GETDATE(),
    TicketPdfUrl NVARCHAR(255),
    QrCodeUrl NVARCHAR(255),
    CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_Orders_Events FOREIGN KEY (EventId) REFERENCES Events(EventId),
    CONSTRAINT FK_Orders_Tickets FOREIGN KEY (TicketId) REFERENCES Tickets(TicketId)
);

-- Tabla de Reseñas
CREATE TABLE Reviews (
    ReviewId INT IDENTITY(1,1) PRIMARY KEY,
    EventId INT NOT NULL,
    UserId INT NOT NULL,
    Rating INT CHECK (Rating BETWEEN 1 AND 5) NOT NULL,
    Comment NVARCHAR(MAX),
    createdAt DATETIMEOFFSET,
    CONSTRAINT FK_Reviews_Events FOREIGN KEY (EventId) REFERENCES Events(EventId),
    CONSTRAINT FK_Reviews_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
 


-- Tabla de Reservaciones
CREATE TABLE Reservations (
    ReservationId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    EventType NVARCHAR(100),
    Location NVARCHAR(255),
    CapacityMin INT,
    CapacityMax INT,
    StartDate DATETIME,
    EndDate DATETIME,
    ServicesRequested NVARCHAR(MAX),
    ContactName NVARCHAR(150),
    ContactEmail NVARCHAR(100),
    ContactPhone NVARCHAR(20),
    DocumentId NVARCHAR(20),
    ClientType NVARCHAR(20) CHECK (ClientType IN ('natural', 'company')),
    Status NVARCHAR(20) CHECK (Status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
    createdAt DATETIMEOFFSET,
    CONSTRAINT FK_Reservations_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Tabla de Notificaciones
CREATE TABLE Notifications (
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Type NVARCHAR(50),
    Message NVARCHAR(MAX),
    ReadStatus BIT DEFAULT 0,
    createdAt DATETIMEOFFSET,
    CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Tabla de Cupones
CREATE TABLE Coupons (
    CouponId INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    DiscountPercentage DECIMAL(5,2) NOT NULL,
    ValidFrom DATE NOT NULL,
    ValidUntil DATE NOT NULL,
    MaxUses INT,
    UsedCount INT DEFAULT 0,
    createdAt  DATETIMEOFFSET,
);

-- Tabla de Favoritos
CREATE TABLE Favorites (
    FavoriteId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    EventId INT NOT NULL,
    createdAt  DATETIMEOFFSET,
    CONSTRAINT FK_Favorites_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_Favorites_Events FOREIGN KEY (EventId) REFERENCES Events(EventId)
)


-- Insertar registros en la tabla de Usuarios
INSERT INTO Users (FullName, BirthDate, Phone, DNI, Email, PasswordHash, Role)
VALUES 
('Juan Pérez', '1990-05-15', '123456789', '12345678A', 'juan.perez@example.com', 'hashedpassword1', 'user'),
('Ana Martínez', '1985-07-22', '987654321', '98765432B', 'ana.martinez@example.com', 'hashedpassword2', 'organizer'),
('Carlos García', '2000-03-30', '555555555', '12365478C', 'carlos.garcia@example.com', 'hashedpassword3', 'user'),
('Laura Sánchez', '1995-12-10', '666666666', '65498723D', 'laura.sanchez@example.com', 'hashedpassword4', 'admin'),
('Pedro Fernández', '1982-11-25', '777777777', '32198765E', 'pedro.fernandez@example.com', 'hashedpassword5', 'user');

-- Insertar registros en la tabla de Eventos
INSERT INTO Events (OrganizerId, Title, Description, StartDate, EndDate, Address, Latitude, Longitude, Visibility, Categories, BannerUrl, VideoUrl, Status, Capacity)
VALUES
(2, 'Concierto de Rock', 'Un evento de música rock en vivo', '2025-06-10 18:00:00', '2025-06-10 22:00:00', 'Avenida Central 123, Ciudad', 40.7128, -74.0060, 'public', 'Música', 'https://example.com/banner1.jpg', 'https://example.com/video1.mp4', 'published', 500),
(2, 'Conferencia de Tecnología', 'Charlas sobre innovación tecnológica', '2025-07-15 09:00:00', '2025-07-15 17:00:00', 'Calle de la Innovación 456, Ciudad', 40.7128, -74.0060, 'public', 'Tecnología', 'https://example.com/banner2.jpg', 'https://example.com/video2.mp4', 'draft', 200),
(1, 'Feria de Emprendedores', 'Exposición de startups y nuevos negocios', '2025-08-01 10:00:00', '2025-08-01 18:00:00', 'Plaza Mayor, Ciudad', 40.7128, -74.0060, 'private', 'Negocios', 'https://example.com/banner3.jpg', 'https://example.com/video3.mp4', 'pending_approval', 300),
(1, 'Festival de Cine', 'Muestra de películas independientes', '2025-09-05 19:00:00', '2025-09-05 23:00:00', 'Calle de las Artes 789, Ciudad', 40.7128, -74.0060, 'invite-only', 'Cine', 'https://example.com/banner4.jpg', 'https://example.com/video4.mp4', 'published', 150),
(2, 'Exposición de Arte', 'Arte contemporáneo en la galería', '2025-05-25 17:00:00', '2025-05-25 21:00:00', 'Calle del Arte 321, Ciudad', 40.7128, -74.0060, 'public', 'Arte', 'https://example.com/banner5.jpg', 'https://example.com/video5.mp4', 'published', 100);

-- Insertar registros en la tabla de Tickets
INSERT INTO Tickets (EventId, Type, Price, Description, StockAvailable)
VALUES
(1, 'General', 50.00, 'Entrada general al concierto', 500),
(2, 'VIP', 100.00, 'Acceso a zona VIP', 100),
(3, 'Expositor', 0.00, 'Entrada para expositores', 50),
(4, 'General', 20.00, 'Entrada general al festival de cine', 150),
(5, 'Normal', 10.00, 'Entrada a la exposición de arte', 100);

-- Insertar registros en la tabla de Pedidos
INSERT INTO Orders (UserId, EventId, TicketId, Quantity, TotalPrice, PaymentStatus)
VALUES
(1, 1, 1, 2, 100.00, 'paid'),
(2, 2, 2, 1, 100.00, 'pending'),
(3, 3, 3, 1, 0.00, 'paid'),
(4, 4, 4, 3, 60.00, 'paid'),
(5, 5, 5, 5, 50.00, 'pending');

-- Insertar registros en la tabla de Reseñas
INSERT INTO Reviews (EventId, UserId, Rating, Comment)
VALUES
(1, 1, 5, '¡Gran concierto! Muy buen ambiente.'),
(2, 2, 4, 'Interesante conferencia, pero algunos ponentes fueron un poco largos.'),
(3, 3, 3, 'La feria fue buena, pero faltaban más startups.'),
(4, 4, 5, 'Excelente festival de cine, las películas fueron muy buenas.'),
(5, 5, 4, 'La exposición fue muy bonita, aunque algunos cuadros estaban mal iluminados.');

-- Insertar registros en la tabla de Reservaciones
INSERT INTO Reservations (UserId, EventType, Location, CapacityMin, CapacityMax, StartDate, EndDate, ServicesRequested, ContactName, ContactEmail, ContactPhone, DocumentId, ClientType, Status)
VALUES
(1, 'Conferencia', 'Hotel Central', 50, 100, '2025-06-05 09:00:00', '2025-06-05 18:00:00', 'Proyector, Catering', 'María López', 'maria.lopez@example.com', '555123456', 'AB1234', 'company', 'confirmed'),
(2, 'Boda', 'Restaurante Los Olivos', 30, 150, '2025-07-10 14:00:00', '2025-07-10 22:00:00', 'Catering, Decoración', 'Pedro Ruiz', 'pedro.ruiz@example.com', '555987654', 'CD5678', 'natural', 'pending'),
(3, 'Evento Corporativo', 'Auditorio Nacional', 100, 300, '2025-08-15 08:00:00', '2025-08-15 17:00:00', 'Equipos de sonido, Pantallas', 'Sofía González', 'sofia.gonzalez@example.com', '555555555', 'EF9101', 'company', 'pending'),
(4, 'Fiesta Privada', 'Casa de Campo', 20, 50, '2025-09-01 19:00:00', '2025-09-01 23:00:00', 'Música, Catering', 'David Martín', 'david.martin@example.com', '555777777', 'GH1122', 'natural', 'confirmed'),
(5, 'Reunión Empresarial', 'Oficinas Corp', 10, 20, '2025-10-01 10:00:00', '2025-10-01 14:00:00', 'Proyector, Coffee Break', 'Laura Fernández', 'laura.fernandez@example.com', '555666666', 'IJ2233', 'company', 'pending');

-- Insertar registros en la tabla de Notificaciones
INSERT INTO Notifications (UserId, Type, Message)
VALUES
(1, 'Evento', '¡El evento Concierto de Rock ha sido publicado!'),
(2, 'Evento', 'La Conferencia de Tecnología ha sido aprobada.'),
(3, 'Pedido', 'Tu pedido para la Feria de Emprendedores ha sido confirmado.'),
(4, 'Reserva', 'La Boda en Restaurante Los Olivos ha sido confirmada.'),
(5, 'Cupones', 'Tienes un nuevo cupón de descuento de 10% para la Exposición de Arte.');

-- Insertar registros en la tabla de Cupones
INSERT INTO Coupons (Code, DiscountPercentage, ValidFrom, ValidUntil, MaxUses)
VALUES
('DESCUENTO10', 10.00, '2025-05-01', '2025-05-31', 100),
('VIP20', 20.00, '2025-06-01', '2025-06-30', 50),
('SUMMER15', 15.00, '2025-07-01', '2025-07-31', 200),
('ART10', 10.00, '2025-08-01', '2025-08-31', 150),
('CONGRESO25', 25.00, '2025-09-01', '2025-09-30', 75);

-- Insertar registros en la tabla de Favoritos
INSERT INTO Favorites (UserId, EventId)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);