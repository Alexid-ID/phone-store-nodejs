import StatisticService from '../../services/statistic.service.js';

class ApiStatisticController {
    async getStatisticToday(req, res) {
        try {
            const statistic = await StatisticService.getStatisticToday();
            return res.status(200).json(statistic);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
    async getStatisticInRange(req, res) {
        try {
            const { fromDate, toDate } = req.body;
            const statistic = await StatisticService.getStatisticInRange(fromDate, toDate);
            return res.status(200).json(statistic);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
    async getStatisticInThisMonth(req, res) {
        try {
            const statistic = await StatisticService.getStatisticInMonth();
            return res.status(200).json(statistic);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
    async getStatisticWithin7Days(req, res) {
        try {
            const statistic = await StatisticService.getStatisticLast7Days();
            return res.status(200).json(statistic);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
    async getStatisticYesterday(req, res) {
        try {
            const statistic = await StatisticService.getStatisticYesterday();
            return res.status(200).json(statistic);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
}

export default new ApiStatisticController();