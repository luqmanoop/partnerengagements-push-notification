import axios from 'axios';
import cheerio from 'cheerio';

const engagementsUrl = 'https://boards.greenhouse.io/partnerengagementstaffing';

class ParternEngagementManager {
  async getEngagements() {
    return axios(engagementsUrl).then(res => {
      const { status, data } = res;
      if (status !== 200) return;

      let $ = cheerio.load(data);
      let openEngagements = [];
      $('div.opening a').each(function() {
        let engagement = $(this).text();
        if (!engagement.toLocaleLowerCase().includes('test-testrp-')) {
          openEngagements.push(engagement);
        }
      });

      return openEngagements;
    });
  }

  compareEngagements(oldEngagements, latestEngagements) {
    return latestEngagements.filter(
      engagement => !oldEngagements.includes(engagement)
    );
  }

  async monitor(cb) {
    try {
      let oldEngagements = await this.getEngagements();

      let handle = setInterval(async () => {
        let latestEngagements = await this.getEngagements();
        let newEngagements = this.compareEngagements(
          oldEngagements,
          latestEngagements
        );
        oldEngagements = latestEngagements;

        cb(newEngagements);
      }, 1000 * 60 * 30); // monitor every 30mins

      process.on('beforeExit', () => clearInterval(handle));
    } catch (error) {
      console.log('error', error);
    }
  }
}

export default new ParternEngagementManager();
