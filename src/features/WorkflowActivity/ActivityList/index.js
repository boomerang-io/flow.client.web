import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
// import ActivityTable from "./ActivityTable";
import LoadingAnimation from "@boomerang/boomerang-components/lib/LoadingAnimation";
import InfiniteScroll from 'react-infinite-scroller';
import ScrollUpButton from "react-scroll-up-button";
import ActivityCard from "./ActivityCard";
import { BASE_SERVICE_URL } from "Config/servicesConfig";
import doubleChevron from "./img/doublechevron.svg";
import "./styles.scss";

class ActivityList extends Component {

  static propTypes = {
    activities: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    searchQuery: PropTypes.string
  };
  state = {
    hasMoreActivities: !this.props.activities.last,
    activitiesList: this.props.activities.records
  };

  loadMoreActivities = (page) => {
    let newActivities = [].concat(this.state.activitiesList);
    axios.get(`${BASE_SERVICE_URL}/activity?size=10&page=${page}&searchQuery=${this.props.searchQuery}`).then(response => {
      const { records, last } = response.data;
      this.setState({activitiesList: newActivities.concat(records), hasMoreActivities:!last});
    });
  }

  render() {
    const { hasMoreActivities, activitiesList } = this.state; 
      return (
        <div className="c-activity-list">
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMoreActivities}
            hasMore={hasMoreActivities}
            loader={<LoadingAnimation className="s-activities-loading"/>}
            useWindow={true}
          >
            {
              activitiesList.map(activity => {
              return <ActivityCard activity={activity} history={this.props.history}/>
              })
            }
          </InfiniteScroll>
          <ScrollUpButton ContainerClassName="c-activities__scroll-up" TransitionClassName="--scroll-up-togled">
              <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                <img className="b-activities__scroll-button" src={doubleChevron} alt="chevron"/>
                <label className="b-activities__scroll-label">Go to top</label>
              </div>
          </ScrollUpButton>
        </div>
      );
    }
}

export default ActivityList;
