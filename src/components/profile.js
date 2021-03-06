import React from 'react'
import { debug, callApiWithJwt } from '../lib.js'
import { config } from '../config.js'
import { Link } from 'react-router-dom';
import { Button, Form, Container, Grid, Message, Card, Image, Statistic, Icon, Divider, Header, Input } from 'semantic-ui-react'
import StripeCheckout from 'react-stripe-checkout';

export class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { amount: 100, chargeFailed: false, chargeSucceeded: false };
    }

    componentDidMount() {
        callApiWithJwt('/user/api/view_profile',
            'GET',
            null,
            (response) => {
                this.setState(response);
                document.title = response.user.username + " | Profile";
            },
            (error) => {
                this.props.history.push('/login/');
            }
        );
    }

    handleChange = (key) => {
        return (e) => {
            var state = {};
            state[key] = e.target.value;
            this.setState(Object.assign({}, this.state, state));
        };
    }

    onToken = (token) => {
        callApiWithJwt('/user/api/charge',
            'POST',
            JSON.stringify({ token: token.id, amount: this.state.amount }),
            (response) => {
                this.setState(Object.assign({}, this.state, { chargeSucceeded: true, chargeFailed: false, advertising_funds: this.state.advertising_funds + amount }))
            },
            (error) => {
                this.setState(Object.assign({}, this.state, { chargeSucceeded: false, chargeFailed: true }))
            }
        );
    }

    render() {
        debug('profile', this.state);
        var advertisingMessage = 'Funds available';
        var publisherMessage = 'Earnings available';

        const funds = this.state.advertising_funds - this.state.advertising_burn;
        const earnings = this.state.publisher_earnings - this.state.publisher_payout;

        const amount = this.state.amount;
        if (this.state.user && this.state.user.username) {
            var body = (
                // <Grid centered columns={1}>
                    <Grid.Row style={{ minHeight: '70vh' }}>
                        <Grid.Column mobile={12} tablet={9} computer={7} largeScreen={5} widescreen={3} verticalAlign='middle'>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header>{this.state.user.username}</Card.Header>
                                    <Card.Description>
                                        <Statistic>
                                            <Statistic.Value style={{ color: funds < 10 ? 'red' : 'green' }}>{funds}<Icon name="dollar" size="mini" /></Statistic.Value>
                                            <Statistic.Label>Funds</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Value>{earnings}<Icon name="dollar" size="mini" /></Statistic.Value>
                                            <Statistic.Label>Earnings</Statistic.Label>
                                        </Statistic>
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className='ui two buttons'>
                                        <Button color='teal' as={Link} to='/dashboard/advertiser/'>Advertiser Dashboard</Button>
                                        <Button color='yellow' as={Link} to='/dashboard/publisher/'>Publisher Dashboard</Button>
                                    </div>
                                </Card.Content>
                            </Card>
                            <Divider />
                            <Header as='h3' className='whiteText'>Add Funds</Header>
                            <Input type='number' min='1' step='1' fluid label="Amount ($)" value={amount} onChange={this.handleChange('amount')} />
                            {amount != parseInt(amount, 10) ? <Message error className='smallText' content="Please round up the amount to nearest dollar value" /> : ''}
                            <br />
                            <StripeCheckout
                                name="Chymera VR Inc."
                                description="Add funds"
                                token={this.onToken}
                                stripeKey={config.stripeKey}
                                amount={this.state.amount * 100}
                                >
                                <Button disabled={amount != parseInt(amount, 10)} fluid content="Pay with Card" color='green' />
                            </StripeCheckout>
                            <br />
                            {this.state.chargeSucceeded ? <Message positive className='smallText' content="Payment Successful" /> : ''}
                            {this.state.chargeFailed ? <Message error className='smallText' content="Payment Failed" /> : ''}
                        </Grid.Column>
                    </Grid.Row>
                // </Grid>
            )
        } else {
            /**
             * The API call hasn't succeeded yet. TODO Show a spinner'
             */
            var body = <div key="notloaded"></div>
        }
        return (
            // <main className="Site-content" style={{ backgroundColor: '#008FCB', minHeight: '100vh' }}>
            <main className="Site-content centre ui aligned blueBackground" >
                <Grid stackable centered columns={1} verticalAlign='top' >
                    <Grid.Row className="page-header-section no-content"></Grid.Row>
                    {body}
                    <Grid.Row></Grid.Row>
                    <Grid.Row></Grid.Row>
                    <Grid.Row></Grid.Row>
                </Grid>
            </main>
            // </main>
        );
    }
}
