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
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
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
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
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
    CreatedAt DATETIME DEFAULT GETDATE(),
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
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Reservations_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Tabla de Notificaciones
CREATE TABLE Notifications (
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Type NVARCHAR(50),
    Message NVARCHAR(MAX),
    ReadStatus BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
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
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Tabla de Favoritos
CREATE TABLE Favorites (
    FavoriteId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    EventId INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Favorites_Users FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT FK_Favorites_Events FOREIGN KEY (EventId) REFERENCES Events(EventId)
); aca esta el script