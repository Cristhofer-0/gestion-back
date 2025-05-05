import { getConnection } from "../database/connection.js"
import sql from 'mssql'

export const getEventos = async (req, res) => {
    const pool = await getConnection()

    const result = await pool.request().query("SELECT * FROM Events")
    res.json(result.recordset)
}

export const getEvento = async (req, res) => {
    const eventId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('EventId', sql.Int, eventId)
            .query('SELECT * FROM Events WHERE EventId = @EventId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el evento" });
    }
}

export const createEvento = async (req, res)  => {
    const pool = await getConnection()

    const result = await pool
        .request()
        .input('OrganizerId', sql.Int, req.body.OrganizerId)
        .input('Title', sql.Text, req.body.Title)
        .input('Description', sql.Text, req.body.Description)
        .input('StartDate', sql.DateTime, req.body.StartDate)
        .input('EndDate', sql.DateTime, req.body.EndDate)
        .input('Address', sql.Text, req.body.Address)
        .input('Latitude', sql.Decimal, req.body.Latitude)
        .input('Longitude', sql.Decimal, req.body.Longitude)
        .input('Visibility', sql.Text, req.body.Visibility)
        .input('Categories', sql.Text, req.body.Categories)
        .input('BannerUrl', sql.Text, req.body.BannerUrl)
        .input('VideoUrl', sql.Text, req.body.VideoUrl)
        .input('Status', sql.Text, req.body.Status)
        .input('Capacity', sql.Int, req.body.Capacity)
        .query('INSERT INTO Events (OrganizerId, Title, Description, StartDate, EndDate,Address, Latitude, Longitude, Visibility, Categories,BannerUrl, VideoUrl, Status, Capacity) VALUES (@OrganizerId, @Title, @Description, @StartDate, @EndDate,@Address, @Latitude, @Longitude, @Visibility, @Categories,@BannerUrl, @VideoUrl, @Status, @Capacity)');
    //console.log(result)
    res.json({
        OrganizerId: req.body.OrganizerId,
        Title: req.body.Title,
        Description: req.body.Description,
        StartDate: req.body.StartDate,
        EndDate: req.body.EndDate,
        Address: req.body.Address,
        Latitude: req.body.Latitude,
        Longitude: req.body.Longitude,
        Visibility: req.body.Visibility,
        Categories: req.body.Categories,
        BannerUrl: req.body.BannerUrl,
        VideoUrl: req.body.VideoUrl,
        Status: req.body.Status,
        Capacity: req.body.Capacity 
    })
}

export const updateEvento = async (req, res) => {
    const eventId = req.params.id;
    const {
        OrganizerId,
        Title,
        Description,
        StartDate,
        EndDate,
        Address,
        Latitude,
        Longitude,
        Visibility,
        Categories,
        BannerUrl,
        VideoUrl,
        Status,
        Capacity
    } = req.body;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('EventId', sql.Int, eventId)
            .input('OrganizerId', sql.Int, OrganizerId)
            .input('Title', sql.Text, Title)
            .input('Description', sql.Text, Description)
            .input('StartDate', sql.DateTime, StartDate)
            .input('EndDate', sql.DateTime, EndDate)
            .input('Address', sql.Text, Address)
            .input('Latitude', sql.Decimal, Latitude)
            .input('Longitude', sql.Decimal, Longitude)
            .input('Visibility', sql.Text, Visibility)
            .input('Categories', sql.Text, Categories)
            .input('BannerUrl', sql.Text, BannerUrl)
            .input('VideoUrl', sql.Text, VideoUrl)
            .input('Status', sql.Text, Status)
            .input('Capacity', sql.Int, Capacity)
            .query(`
                UPDATE Events
                SET OrganizerId = @OrganizerId,
                    Title = @Title,
                    Description = @Description,
                    StartDate = @StartDate,
                    EndDate = @EndDate,
                    Address = @Address,
                    Latitude = @Latitude,
                    Longitude = @Longitude,
                    Visibility = @Visibility,
                    Categories = @Categories,
                    BannerUrl = @BannerUrl,
                    VideoUrl = @VideoUrl,
                    Status = @Status,
                    Capacity = @Capacity
                WHERE EventId = @EventId
            `);

        res.status(200).json({ message: "Evento actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el evento" });
    }

}

export const deleteEvento = async (req, res) => {
    const eventId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('EventId', sql.Int, eventId)
            .query('DELETE FROM Events WHERE EventId = @EventId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        res.json({ message: "Evento eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el evento" });
    }
}